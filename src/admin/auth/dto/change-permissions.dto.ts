import { IsArray, IsNotEmpty } from 'class-validator';
import { AdminPermissions } from '../../entities/admin-user.entity';

export class ChangePermissionsDto {
  @IsArray()
  @IsNotEmpty()
  permissions: AdminPermissions[];
}
