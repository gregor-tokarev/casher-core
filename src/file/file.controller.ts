import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':file_id')
  async getFile(
    @Param('file_id', ParseUUIDPipe) fileId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const fileRow = await this.fileService.getFileRow(fileId);

    res.set({
      'content-type': fileRow.mimetype,
    });

    const stream = await this.fileService.streamFile(fileRow.path);
    return new StreamableFile(stream);
  }
}
