import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeletePhotosDto {
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  photoIds: string[];
}
