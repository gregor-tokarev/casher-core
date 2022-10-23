import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import { AdminModule } from './admin/admin.module';
import { CoreModule } from './core/core.module';
import { AppConfigModule } from './config/app-config.module';

@Module({
  imports: [AppConfigModule.forRoot(), HealthModule, AdminModule, CoreModule],
  controllers: [AppController],
})
export class AppModule {}
