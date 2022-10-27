import { Module } from '@nestjs/common';
import { AdminUserService } from './services/user.service';
import { AdminUsersController } from './users.controller';
import { CoreModule } from '../../core/core.module';
import { AdminAuthModule } from '../auth/auth.module';

@Module({
  imports: [CoreModule, AdminAuthModule],
  providers: [AdminUserService],
  controllers: [AdminUsersController],
})
export class AdminUsersModule {}
