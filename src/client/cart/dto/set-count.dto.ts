import { IsNumber, Max, Min } from 'class-validator';

export class SetCountDto {
  @Min(0)
  @Max(999)
  @IsNumber()
  count: number;
}
