import { MINIO_CLIENT } from '@config/providerts';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { minoConfig } from '@config/mino.config';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FileController } from './file.controller';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [
    {
      provide: MINIO_CLIENT,
      inject: [ConfigService],
      useFactory: minoConfig,
    },
    FileService,
  ],
  exports: [FileService],
  controllers: [FileController],
})
export class FileModule {}
