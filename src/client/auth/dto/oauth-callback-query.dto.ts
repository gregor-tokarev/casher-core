import { IsNotEmpty } from 'class-validator';

export class OauthCallbackQueryDto {
  @IsNotEmpty()
  code: string;
}
