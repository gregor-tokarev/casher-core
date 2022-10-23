import { IsNotEmpty, MinLength } from 'class-validator';

export class SetPasswordDto {
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
