import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AdminAuthManageService } from '../services/manage.service';

@Injectable()
export class AccessAdminGuard implements CanActivate {
  constructor(private readonly adminManageService: AdminAuthManageService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const { admin_id: adminId } = context.switchToHttp().getRequest().params;

    const remover = await this.adminManageService.findByOrFail(user.sub);
    const removed = await this.adminManageService.findByOrFail(adminId);

    return remover.addedBy === null || removed.addedBy === remover.id;
  }
}
