import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVars } from '@config/environment-vars';
import * as Minio from 'minio';
import { Readable } from 'stream';
import { MINIO_CLIENT } from '@config/providers';
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
    return this.minioClient.putObject(
      this.configService.get('MINO_APP_BUCKET'),
      path,
      file.buffer,
    );
  }

  private async removeFromBucket(path: string): Promise<void> {
    await this.minioClient.removeObject(
      this.configService.get('MINO_APP_BUCKET'),
      path,
    );
  }

  private async addFile(
    path: string,
    fileId: string,
    file: Express.Multer.File,
  ): Promise<File> {
    const { etag } = await this.uploadFile(path, file);

    const fileRow = new File();
    fileRow.id = fileId;
    fileRow.etag = etag;
    fileRow.originalname = file.originalname;
    fileRow.path = path;
    fileRow.mimetype = file.mimetype;

    return fileRow.save();
  }

  async addClientFile(addFileDto: AddFileDto): Promise<File> {
    const fileId = v4();
    const path = `/users/${addFileDto.userId}/${fileId}.${this.getExtension(
      addFileDto.file,
    )}`;

    return this.addFile(path, fileId, addFileDto.file);
  }

  async removeFile(fileId: string): Promise<File> {
    const fileRow = await this.getFileRow(fileId);
    await Promise.all([this.removeFromBucket(fileRow.path), fileRow.remove()]);

    return fileRow;
  }

  async addAdminFile(addFileDto: AddFileDto): Promise<File> {
    const fileId = v4();
    const path = `/admins/${addFileDto.userId}/${fileId}.${this.getExtension(
      addFileDto.file,
    )}`;

    return this.addFile(path, fileId, addFileDto.file);
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
