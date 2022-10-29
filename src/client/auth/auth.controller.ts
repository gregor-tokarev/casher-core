import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientAuthService } from './services/auth.service';
import { GetClientUser } from './decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('client/auth')
export class ClientAuthController {
  constructor(private readonly authService: ClientAuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-client-refresh'))
  @Post('/refresh')
  async refreshAuth(
    @GetClientUser('sub') userId: string,
    @Body('token') refreshToken: string,
  ) {
    return this.authService.refreshAuth(userId, refreshToken);
  }
}
