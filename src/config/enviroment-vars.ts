export interface EnviromentVars {
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_DB: string;
  DATABASE_SCHEMA: string;

  JWT_ADMIN_ACCESS_SECRET: string;
  JWT_ADMIN_REFRESH_SECRET: string;
}
