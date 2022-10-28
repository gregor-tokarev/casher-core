import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import { AdminModule } from './admin/admin.module';
import { AppConfigModule } from './config/app-config.module';
import { SearchModule } from './search/search.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    ClientModule,
    SearchModule,
    HealthModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
