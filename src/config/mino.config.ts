import { EnvironmentVars } from '@config/environment-vars';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

export function minoConfig(
  configService: ConfigService<EnvironmentVars>,
): Minio.Client {
  return new Minio.Client({
    endPoint: configService.get('MINO_HOST'),
    port: configService.get('MINO_PORT'),
    useSSL: false, // TODO: make true in production

    accessKey: configService.get('MINO_ACCESS_KEY'),
    secretKey: configService.get('MINO_SECRET_KEY'),
  });
}
