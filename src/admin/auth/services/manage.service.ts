import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { AdminPermissions, AdminUser } from '../../entities/admin-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePermissionsDto } from '../dto/change-permissions.dto';
import { CreateFirstAdminDto } from '../dto/create-first-admin.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { SetPasswordDto } from '../dto/set-password.dto';
import { adminNotFound } from '../errors';

@Injectable()
export class AdminManageService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
  ) {}

  async findAll(top: number, skip: number): Promise<AdminUser[]> {
    return this.adminUserRepository.find({ take: top, skip });
  }

  async count(): Promise<number> {
    return this.adminUserRepository.count();
  }

  async isEmailExist(email: string): Promise<boolean> {
    const adminUser = await this.adminUserRepository.findOneBy({
      email,
    });

    return !!adminUser;
  }

  async findById(id: string): Promise<AdminUser> {
    const admin = await this.adminUserRepository.findOneBy({ id });
    if (!admin) {
      throw new NotFoundException(adminNotFound);
    }

    return admin;
  }

  async delete(id: string): Promise<void> {
    await this.adminUserRepository.delete({ id });
  }

  async setPassword(
    id: string,
    setPasswordDto: SetPasswordDto,
  ): Promise<AdminUser> {
    const admin = await this.adminUserRepository.findOneByOrFail({ id });
    if (admin.password) {
      throw new ForbiddenException('Password already set');
    }

    admin.password = setPasswordDto.password;

    return admin.save();
  }

  async create(
    createAdminDto: CreateFirstAdminDto | CreateAdminDto,
    addedBy?: string,
  ): Promise<AdminUser> {
    const adminUser = new AdminUser();
    adminUser.email = createAdminDto.email;
    if ('password' in createAdminDto)
      adminUser.password = createAdminDto.password;

    if ('permissions' in createAdminDto) {
      adminUser.permissions = createAdminDto.permissions;
    } else {
      adminUser.permissions = [
        AdminPermissions.CREATE_PRODUCTS,
        AdminPermissions.DELETE_PRODUCTS,
        AdminPermissions.UPDATE_PRODUCTS,
        AdminPermissions.ADD_ADMIN,
        AdminPermissions.ADD_PLUGINS,
        AdminPermissions.AUTH_SETTINGS,
        AdminPermissions.DB_SETTINGS,
      ];
    }
    adminUser.addedBy = addedBy;

    return adminUser.save();
  }

  async changePermissions(
    adminId: string,
    changePermissionsDto: ChangePermissionsDto,
  ): Promise<AdminUser> {
    const admin = await this.findById(adminId);
    admin.permissions = changePermissionsDto.permissions;

    return admin.save();
  }
}
