import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentSchema } from './environment-schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './typeorm.config';

@Module({})
export class AppConfigModule {
  public static forRoot(): DynamicModule {
    const imports = [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: typeormConfig,
      }),
      ConfigModule.forRoot({
        isGlobal: true,
        validationSchema: EnvironmentSchema,
        envFilePath: ['.env'],
      }),
    ];
    const exports = [ConfigModule, TypeOrmModule];

    return {
      module: AppConfigModule,
      imports,
      exports,
    };
  }
}
