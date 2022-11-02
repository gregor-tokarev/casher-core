import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import { AdminModule } from './admin/admin.module';
import { AppConfigModule } from '@config/app-config.module';
import { ClientModule } from './client/client.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    ClientModule,
    FileModule,
    HealthModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
