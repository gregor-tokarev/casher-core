import { IsUUID } from 'class-validator';

export class ManageProductsDto {
  @IsUUID(undefined, { each: true })
  products: string[];
}
