import { AdminPermissions } from '../../entities/admin-user.entity';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../guards/permissoin.guard';

export const permissionKey = 'permissions';

export function Permissions(...permissions: AdminPermissions[]) {
  return applyDecorators(
    SetMetadata(permissionKey, permissions),
    UseGuards(PermissionGuard),
  );
}
