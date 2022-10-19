import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { EnviromentVars } from './enviroment-vars';

export function typeormConfig(
  configService: ConfigService<EnviromentVars>,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_DB'),
    entities: [],
  };
}
