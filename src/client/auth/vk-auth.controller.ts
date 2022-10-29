import { OauthOptionService } from '@core/services/oauth-option.service';
import { UserManageService } from './services/manage.service';
import { HttpService } from '@nestjs/axios';
import * as qs from 'node:querystring';
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Redirect,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { OauthCallbackQueryDto } from './dto/oauth-callback-query.dto';
import { VkOauthTokensDto } from './dto/vk-oauth-tokens.dto';
import { VkOauthDto } from './dto/vk-oauth.dto';
import { ClientAuthService } from './services/auth.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVars } from '@config/environment-vars';

@Controller('client/auth/vk')
export class VkAuthController {
  constructor(
    private readonly oauthOptionService: OauthOptionService,
    private readonly clientAuthManageService: UserManageService,
    private readonly clientAuthService: ClientAuthService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvironmentVars>,
  ) {}

  private getRedirectUri(req: Request): string {
    return `${req.protocol}://${req.get('Host')}/client/auth/vk/callback`;
  }

  @Redirect()
  @Get()
  async vkOauth(@Req() req: Request) {
    const option = await this.oauthOptionService.findBy({ name: 'vk' });
    if (!option.enabled) {
      throw new BadRequestException('Vk oauth is disabled');
    }

    return {
      url: `https://oauth.vk.com/authorize?client_id=${
        option.credentials.clientID
      }&response_type=code&redirect_uri=${this.getRedirectUri(
        req,
      )}&scope=email`,
    };
  }

  @Redirect()
  @Get('/callback')
  async vkOauthCallback(
    @Query() oauthCallbackQueryDto: OauthCallbackQueryDto,
    @Req() req: Request,
  ) {
    const option = await this.oauthOptionService.findBy({ name: 'vk' });

    const { data: tokenResponse } =
      await this.httpService.axiosRef.get<VkOauthTokensDto>(
        `https://oauth.vk.com/access_token?client_id=${
          option.credentials.clientID
        }&client_secret=${option.credentials.clientSecret}&code=${
          oauthCallbackQueryDto.code
        }&scope=email&redirect_uri=${this.getRedirectUri(req)}`,
      );

    const {
      data: {
        response: [userResponse],
      },
    } = await this.httpService.axiosRef.post<VkOauthDto>(
      'https://api.vk.com/method/users.get',
      qs.stringify({
        fields: 'sex,photo_100',
        access_token: tokenResponse.access_token,
        v: '5.131',
      }),
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      },
    );

    let user = await this.clientAuthManageService.findBy({
      oauth: { providerId: userResponse.id.toString() },
    });

    if (!user) {
      user = await this.clientAuthManageService.create({
        name: userResponse.first_name,
        surname: userResponse.last_name,
        sex: userResponse.sex === 2 ? 'male' : 'female',
        avatarUrl: userResponse.photo_100,

        oauth: {
          provider: 'vk',
          providerId: userResponse.id.toString(),
          token: tokenResponse.access_token,
          email: tokenResponse.email,
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
