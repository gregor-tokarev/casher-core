import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AdminAuthService } from '../services/admin-auth.service';

@Injectable()
export class AccessAdminGuard implements CanActivate {
  constructor(private readonly authService: AdminAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const { admin_id: adminId } = context.switchToHttp().getRequest().params;

    const remover = await this.authService.findById(user.sub);
    const removed = await this.authService.findById(adminId);

    return remover.addedBy === null || removed.addedBy === remover.id;
  }
}
