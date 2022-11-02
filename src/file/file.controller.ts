import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  StreamableFile,
} from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':file_id')
  async getFile(
    @Param('file_id', ParseUUIDPipe) fileId: string,
  ): Promise<StreamableFile> {
    const fileRow = await this.fileService.getFileRow(fileId);

    const stream = await this.fileService.streamFile(fileRow.path);
    return new StreamableFile(stream);
  }
}
