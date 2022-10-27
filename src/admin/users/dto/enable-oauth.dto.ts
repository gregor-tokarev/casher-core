import { IsJSON, IsOptional } from 'class-validator';

export class EnableOauthDto {
  @IsJSON()
  @IsOptional()
  credentials?: string;
}
