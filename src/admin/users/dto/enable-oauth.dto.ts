import { IsJSON } from 'class-validator';

export class EnableOauthDto {
  @IsJSON()
  credentials: string;
}
