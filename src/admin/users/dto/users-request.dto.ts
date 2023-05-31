import { IsNumber } from 'class-validator';

export class UsersRequestDto {
  @IsNumber()
  skip = 0;
  @IsNumber()
  limit = 20;
}
