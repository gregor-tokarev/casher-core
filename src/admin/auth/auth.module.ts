import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AdminAuthService } from './services/admin-auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from '../entities/admin-user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AdminAccessTokenStrategy } from './strategies/admin-access-token.strategy';
import { AdminRefreshTokenStrategy } from './strategies/admin-refresh-token.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AdminAuthService,
    AdminAccessTokenStrategy,
    AdminRefreshTokenStrategy,
  ],
})
export class AuthModule {}
