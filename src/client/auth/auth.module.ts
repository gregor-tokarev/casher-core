import { Module } from '@nestjs/common';
import { ClientAuthService } from './services/auth.service';
import { UserManageService } from './services/manage.service';
import { CoreModule } from '@core/core.module';
import { YandexAuthController } from './yandex-auth.controller';
import { HttpModule } from '@nestjs/axios';
import { VkAuthController } from './vk-auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ClientRefreshTokenStrategy } from './strategies/client-refresh-token.strategy';
import { ClientAccessTokenStrategy } from './strategies/client-access-token.strategy';
import { ClientAuthController } from './auth.controller';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [CoreModule, HttpModule, CartModule, JwtModule.register({})],
  providers: [
    ClientAuthService,
    UserManageService,
    ClientRefreshTokenStrategy,
    ClientAccessTokenStrategy,
  ],
  controllers: [YandexAuthController, VkAuthController, ClientAuthController],
})
export class ClientAuthModule {}
