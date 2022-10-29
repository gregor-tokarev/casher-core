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

@Module({
  imports: [
    CoreModule,
    HttpModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
  ],
  providers: [ClientAuthService, UserManageService],
  controllers: [YandexAuthController, VkAuthController],
})
export class ClientAuthModule {}
