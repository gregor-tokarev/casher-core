import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { permissionKey } from '../decorators/set-permission.decorator';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminPermissions } from '../../entities/admin-user.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AdminAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      AdminPermissions[]
    >(permissionKey, [context.getHandler(), context.getClass()]);
    if (!requiredPermissions) {
      return true;
    }
    const { user: jwtPayload } = context.switchToHttp().getRequest();

    const admin = await this.authService.findById(jwtPayload.sub);

    return requiredPermissions.some((permission) =>
      admin.permissions.includes(permission),
    );
  }
}
