import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Redirect,
} from '@nestjs/common';
import { OauthOptionService } from '../../core/services/oauth-option.service';
import { HttpService } from '@nestjs/axios';
import { Buffer } from 'buffer';
import * as qs from 'node:querystring';
import { YandexOauthDto } from './dto/yandex-oauth.dto';
import { YandexCallbackQueryDto } from './dto/yandex-callback-query.dto';
import { ClientAuthManageService } from './services/manage.service';
import { YandexOauthTokensDto } from './dto/yandex-oauth-tokens.dto';

@Controller('client/auth')
export class ClientAuthController {
  constructor(
    private readonly oauthOptionService: OauthOptionService,
    private readonly clientAuthManageService: ClientAuthManageService,
    private readonly httpService: HttpService,
  ) {}

  @Redirect('https://oauth.yandex.ru', 302)
  @Get('/yandex')
  async yandexOauth() {
    const option = await this.oauthOptionService.findBy({ name: 'yandex' });
    if (!option.enabled) {
      throw new BadRequestException('Yandex oauth is disabled');
    }

    return {
      url: `https://oauth.yandex.ru/authorize?client_id=${option.credentials.clientID}&response_type=code`,
    };
  }

  @Get('/yandex/callback')
  async yandexOauthCallback(
    @Query() yandexCallbackQueryDto: YandexCallbackQueryDto,
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
          code: yandexCallbackQueryDto.code,
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

    const avatarUrl = `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-75`;

    await this.clientAuthManageService.create({
      name: data.first_name,
      surname: data.last_name,
      sex: data.sex,
      avatarUrl,
      oauth: {
        refreshToken: tokenResponse.refresh_token,
        email: data.default_email,
        provider: 'yandex',
      },
    });
  }
}
