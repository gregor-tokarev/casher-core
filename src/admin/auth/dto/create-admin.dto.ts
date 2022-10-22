import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';
import { AdminPermissions } from '../../entities/admin-user.entity';

export class CreateAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsArray()
  @IsNotEmpty()
  permissions: AdminPermissions[];
}
