import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OauthOption } from '@core/entities/oauth-option.entity';
import { AdminUserService } from './services/user.service';
import { MessageDto } from '@core/dto/message.dto';
import { EnableOauthDto } from './dto/enable-oauth.dto';
import { UsersResponseDto } from './dto/users-response.dto';
import { UsersRequestDto } from './dto/users-request.dto';

@UseGuards(AuthGuard('jwt-admin-access'))
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly userService: AdminUserService) {}

  @Get()
  getAllUsers(
    @Query() usersRequestDto: Record<string, string>,
  ): Promise<UsersResponseDto> {
    return this.userService.getAllUsers(
      usersRequestDto as unknown as UsersRequestDto,
    );
  }

  @Get('/oauth')
  getAllOauthOptions(): Promise<OauthOption[]> {
    return this.userService.getAllOauthOptions();
  }

  @Post('/oauth/:oauth_id/enable')
  async enableOption(
    @Param('oauth_id', ParseUUIDPipe) oauthId: string,
    @Body() enableDto: EnableOauthDto,
  ): Promise<MessageDto> {
    await this.userService.checkCredentials(
      oauthId,
      JSON.parse(enableDto.credentials),
    );

    await this.userService.enableOauthOption(oauthId, enableDto);

    return { message: 'ok' };
  }

  @Post('/oauth/:oauth_id/disable')
  async disableOption(
    @Param('oauth_id', ParseUUIDPipe) oauthId: string,
  ): Promise<MessageDto> {
    await this.userService.disableOauthOption(oauthId);

    return { message: 'ok' };
  }
}
