import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './admin/admin.module';
import { AppConfigModule } from '@config/app-config.module';
import { ClientModule } from './client/client.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [AppConfigModule.forRoot(), ClientModule, FileModule, AdminModule],
  controllers: [AppController],
})
export class AppModule {}
