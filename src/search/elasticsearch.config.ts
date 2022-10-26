import { ConfigService } from '@nestjs/config';
import { EnvironmentVars } from '../config/environment-vars';
import { ClientOptions } from '@elastic/elasticsearch';

export function elasticsearchConfig(
  configService: ConfigService<EnvironmentVars>,
): ClientOptions {
  return {
    node: configService.get('ELASTICSEARCH_NODE'),
    auth: {
      username: configService.get('ELASTICSEARCH_USERNAME'),
      password: configService.get('ELASTICSEARCH_PASSWORD'),
    },
  };
}
