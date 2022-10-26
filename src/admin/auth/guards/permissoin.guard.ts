import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { permissionKey } from '../decorators/set-permission.decorator';
import { AdminPermissions } from '../../entities/admin-user.entity';
import { AdminManageService } from '../services/manage.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly adminManageService: AdminManageService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      AdminPermissions[]
    >(permissionKey, [context.getHandler(), context.getClass()]);
    if (!requiredPermissions) {
      return true;
    }
    const { user: jwtPayload } = context.switchToHttp().getRequest();

    const admin = await this.adminManageService.findById(jwtPayload.sub);

    return requiredPermissions.some((permission) =>
      admin.permissions.includes(permission),
    );
  }
}
