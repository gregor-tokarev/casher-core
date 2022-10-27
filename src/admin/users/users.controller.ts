import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClientOauthOption } from '../../core/entities/oauth-option.entity';
import { AdminUserService } from './services/user.service';
import { OkDto } from '../dto/ok.dto';
import { EnableOauthDto } from './dto/enable-oauth.dto';

@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly userService: AdminUserService) {}

  @UseGuards(AuthGuard('jwt-admin-access'))
  @Get('/oauth')
  getAllOauthOptions(): Promise<ClientOauthOption[]> {
    return this.userService.getAllOauthOptions();
  }

  @UseGuards(AuthGuard('jwt-admin-access'))
  @Post('/oauth/:oauth_id/enable')
  async enableOption(
    @Param('oauth_id', ParseUUIDPipe) oauthId: string,
    @Body() enableDto: EnableOauthDto,
  ): Promise<OkDto> {
    await this.userService.checkCredentials(
      oauthId,
      JSON.parse(enableDto.credentials),
    );

    await this.userService.enableOauthOption(oauthId, enableDto);

    return { message: 'ok' };
  }

  @UseGuards(AuthGuard('jwt-admin-access'))
  @Post('/oauth/:oauth_id/disable')
  async disableOption(
    @Param('oauth_id', ParseUUIDPipe) oauthId: string,
  ): Promise<OkDto> {
    await this.userService.disableOauthOption(oauthId);

    return { message: 'ok' };
  }
}
