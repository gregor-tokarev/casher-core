import { Module } from '@nestjs/common';
import { ClientAuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [ClientAuthModule, ReviewModule],
})
export class ClientModule {}
