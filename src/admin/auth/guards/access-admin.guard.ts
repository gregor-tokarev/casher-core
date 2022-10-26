import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AdminManageService } from '../services/manage.service';

@Injectable()
export class AccessAdminGuard implements CanActivate {
  constructor(private readonly adminManageService: AdminManageService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const { admin_id: adminId } = context.switchToHttp().getRequest().params;

    const remover = await this.adminManageService.findById(user.sub);
    const removed = await this.adminManageService.findById(adminId);

    return remover.addedBy === null || removed.addedBy === remover.id;
  }
}
