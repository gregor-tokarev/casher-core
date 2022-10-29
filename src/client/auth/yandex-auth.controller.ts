import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Redirect,
} from '@nestjs/common';
import { OauthOptionService } from '@core/services/oauth-option.service';
import { HttpService } from '@nestjs/axios';
import { Buffer } from 'buffer';
import * as qs from 'node:querystring';
import { YandexOauthDto } from './dto/yandex-oauth.dto';
import { OauthCallbackQueryDto } from './dto/oauth-callback-query.dto';
import { UserManageService } from './services/manage.service';
import { YandexOauthTokensDto } from './dto/yandex-oauth-tokens.dto';
import { ClientAuthService } from './services/auth.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVars } from '@config/environment-vars';

@Controller('client/auth/yandex')
export class YandexAuthController {
  constructor(
    private readonly oauthOptionService: OauthOptionService,
    private readonly clientAuthManageService: UserManageService,
    private readonly clientAuthService: ClientAuthService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvironmentVars>,
  ) {}

  @Redirect()
  @Get()
  async yandexOauth() {
    const option = await this.oauthOptionService.findBy({ name: 'yandex' });
    if (!option.enabled) {
      throw new BadRequestException('Yandex oauth is disabled');
    }

    return {
      url: `https://oauth.yandex.ru/authorize?client_id=${option.credentials.clientID}&response_type=code`,
    };
  }

  @Redirect()
  @Get('/callback')
  async yandexOauthCallback(
    @Query() oauthCallbackQueryDto: OauthCallbackQueryDto,
  ) {
    const option = await this.oauthOptionService.findBy({ name: 'yandex' });
    const authToken = Buffer.from(
      `${option.credentials.clientID}:${option.credentials.clientSecret}`,
    ).toString('base64');

    const { data: tokenResponse } =
      await this.httpService.axiosRef.post<YandexOauthTokensDto>(
        'https://oauth.yandex.ru/token',
        qs.stringify({
          grant_type: 'authorization_code',
          code: oauthCallbackQueryDto.code,
        }),
        {
          headers: {
            Authorization: `Basic ${authToken}`,
            'content-type': 'application/x-www-form-urlencoded',
          },
        },
      );

    const { data } = await this.httpService.axiosRef.get<YandexOauthDto>(
      'https://login.yandex.ru/info',
      { headers: { Authorization: `OAuth ${tokenResponse.access_token}` } },
    );
    let user = await this.clientAuthManageService.findBy({
      oauth: { providerId: data.id },
    });

    if (!user) {
      const avatarUrl = `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-75`;

      user = await this.clientAuthManageService.create({
        name: data.first_name,
        surname: data.last_name,
        sex: data.sex,
        avatarUrl,
        oauth: {
          providerId: data.id,
          token: tokenResponse.refresh_token,
          email: data.default_email,
          provider: 'yandex',
        },
      });
    }
    const tokens = await this.clientAuthService.getTokens(user.id);
    user.hashedRefreshToken = tokens.refreshToken;

    const frontendUrl = this.configService.get('FRONTEND_URL');
    return {
      url: `${frontendUrl}/auth/oauth?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    };
  }
}
