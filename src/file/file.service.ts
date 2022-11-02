import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVars } from '@config/environment-vars';
import { MINIO_CLIENT } from '@config/providerts';
import * as Minio from 'minio';
import { Readable } from 'stream';
import { AddFileDto } from './dto/add-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

@Injectable()
export class FileService implements OnModuleInit {
  constructor(
    @Inject(MINIO_CLIENT) private readonly minioClient: Minio.Client,
    private readonly configService: ConfigService<EnvironmentVars>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async onModuleInit(): Promise<any> {
    const isExists = await this.minioClient.bucketExists(
      this.configService.get('MINO_APP_BUCKET'),
    );

    if (!isExists) {
      await this.minioClient.makeBucket(
        this.configService.get('MINO_APP_BUCKET'),
        'cn-north-1',
      );
    }
  }

  private uploadFile(
    path: string,
    file: Express.Multer.File,
  ): Promise<Minio.UploadedObjectInfo> {
    return new Promise((resolve, reject) => {
      this.minioClient.putObject(
        this.configService.get('MINO_APP_BUCKET'),
        path,
        file.buffer,
        (error, etag) => {
          if (error) {
            return reject(error);
          }

          resolve(etag);
        },
      );
    });
  }

  async addUserFile(addFileDto: AddFileDto): Promise<File> {
    const fileId = v4();
    const path = `/users/${addFileDto.userId}/${fileId}.${this.getExtension(
      addFileDto.file,
    )}`;
    const { etag } = await this.uploadFile(path, addFileDto.file);

    const file = new File();
    file.id = fileId;
    file.etag = etag;
    file.originalname = addFileDto.file.originalname;
    file.path = path;

    return file.save();
  }

  private getExtension(file: Express.Multer.File): string {
    return file.originalname.split('.')[1];
  }

  async getFileRow(fileId: string): Promise<File> {
    const file = await this.fileRepository.findOneBy({ id: fileId });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  streamFile(path: string): Promise<Readable> {
    return new Promise((resolve, reject) => {
      this.minioClient.getObject(
        this.configService.get('MINO_APP_BUCKET'),
        path,
        (error, stream) => {
          if (error) {
            return reject(error);
          }

          resolve(stream);
        },
      );
    });
  }
}
