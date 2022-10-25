import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentSchema } from './environment-schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './typeorm.config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { elasticsearchConfig } from './elasticsearch.config';

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
    const exports: any[] = [ConfigModule, TypeOrmModule];

    if (process.env.ELASTICSEARCH_NODE) {
      imports.push(
        ElasticsearchModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: elasticsearchConfig,
        }),
      );

      exports.push(ElasticsearchModule);
    }

    return {
      module: AppConfigModule,
      imports,
      exports,
    };
  }
}
