import { Module } from '@nestjs/common';
import { ClientAuthModule } from './auth/auth.module';

@Module({
  imports: [ClientAuthModule],
})
export class ClientModule {}
