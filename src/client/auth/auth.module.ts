import { Module } from '@nestjs/common';
import { ClientAuthService } from './services/auth.service';
import { ClientAuthManageService } from './services/manage.service';
import { CoreModule } from '../../core/core.module';
import { ClientAuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Module({
  imports: [CoreModule, HttpModule, TypeOrmModule.forFeature([User])],
  providers: [ClientAuthService, ClientAuthManageService],
  controllers: [ClientAuthController],
})
export class ClientAuthModule {}
