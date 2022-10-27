import { IsNotEmpty } from 'class-validator';

export class YandexCallbackQueryDto {
  @IsNotEmpty()
  code: string;
}
