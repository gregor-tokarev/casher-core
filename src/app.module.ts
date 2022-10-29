import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import { AdminModule } from './admin/admin.module';
import { AppConfigModule } from '@config/app-config.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [AppConfigModule.forRoot(), ClientModule, HealthModule, AdminModule],
  controllers: [AppController],
})
export class AppModule {}
