import { Module } from '@nestjs/common';
import { ClientAuthService } from './services/auth.service';
import { UserManageService } from './services/manage.service';
import { CoreModule } from '@core/core.module';
import { YandexAuthController } from './yandex-auth.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { VkAuthController } from './vk-auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ClientRefreshTokenStrategy } from './strategies/client-refresh-token.strategy';
import { ClientAccessTokenStrategy } from './strategies/client-access-token.strategy';
import { ClientAuthController } from './auth.controller';

@Module({
  imports: [
    CoreModule,
    HttpModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
  ],
  providers: [
    ClientAuthService,
    UserManageService,
    ClientRefreshTokenStrategy,
    ClientAccessTokenStrategy,
  ],
  controllers: [YandexAuthController, VkAuthController, ClientAuthController],
})
export class ClientAuthModule {}
