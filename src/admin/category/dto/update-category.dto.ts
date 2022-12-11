import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
  @Length(2, 100)
  @IsString()
  @IsNotEmpty()
  name: string;
}
