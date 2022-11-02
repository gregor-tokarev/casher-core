export interface EnvironmentVars {
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_DB: string;
  DATABASE_SCHEMA: string;

  JWT_ADMIN_ACCESS_SECRET: string;
  JWT_ADMIN_REFRESH_SECRET: string;
  JWT_CLIENT_ACCESS_SECRET: string;
  JWT_CLIENT_REFRESH_SECRET: string;

  ELASTICSEARCH_NODE?: string;
  ELASTICSEARCH_USERNAME?: string;
  ELASTICSEARCH_PASSWORD?: string;

  MINO_HOST?: string;
  MINO_PORT?: string;
  MINO_APP_BUCKET?: string;
  MINO_ACCESS_KEY?: string;
  MINO_SECRET_KEY?: string;

  FRONTEND_URL: string;
}
