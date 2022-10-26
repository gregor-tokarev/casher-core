import { AdminUser } from '../../entities/admin-user.entity';

export class AllAdminsDto {
  admins: Partial<AdminUser>[];
  count: number;
}
