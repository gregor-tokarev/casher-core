import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateFirstAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
