import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthService } from './services/auth.service';
import { AdminTokensDto } from './dto/tokens.dto';
import { CreateFirstAdminDto } from './dto/create-first-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetAdminUser } from './decorators/get-user.decorator';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminPermissions, AdminUser } from '../entities/admin-user.entity';
import { Permissions } from './decorators/set-permission.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { MessageDto } from '@core/dto/message.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { AccessAdminGuard } from './guards/access-admin.guard';
import { ChangePermissionsDto } from './dto/change-permissions.dto';
import { AdminAuthManageService } from './services/manage.service';
import { AllAdminsDto } from './dto/all-admins.dto';

@Controller('admin/auth')
export class AuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly adminManageService: AdminAuthManageService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/add_first')
  async addFirstAdmin(
    @Body() createAdminDto: CreateFirstAdminDto,
  ): Promise<AdminTokensDto> {
    const count = await this.adminManageService.count();
    if (count !== 0) {
      throw new ForbiddenException("You can't add new admin");
    }

    return this.adminAuthService.signup(createAdminDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/has-any-admin')
  async hasAnyAdmin(): Promise<MessageDto> {
    const admins = await this.adminManageService.findAll();

    return {
      message: admins.length > 0 ? 'yes' : 'no',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-admin-access'))
  @Get('/current')
  async getCurrentAdmin(
    @GetAdminUser('sub') adminId: string,
  ): Promise<Partial<AdminUser>> {
    const admin = await this.adminManageService.findByOrFail({ id: adminId });
    return admin.publicView();
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() body: LoginAdminDto,
  ): Promise<AdminTokensDto | MessageDto> {
    return this.adminAuthService.login(body);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-admin-access'))
  @Post('/logout')
  async logout(@GetAdminUser('sub') adminId: string): Promise<MessageDto> {
    await this.adminManageService.clearRefreshToken(adminId);
    return { message: 'ok' };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-admin-access'))
  @Get()
  async getAllAdmins(): Promise<AllAdminsDto> {
    const admins = await this.adminManageService.findAll();
    const count = await this.adminManageService.count();

    return { admins: admins.map((adm) => adm.publicView()), count };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-admin-refresh'))
  @Post('/refresh')
  async refreshToken(
    @GetAdminUser('sub') userId: string,
    @Body('token') refreshToken: string,
  ): Promise<AdminTokensDto> {
    return this.adminAuthService.refreshAuth(userId, refreshToken);
  }

  @HttpCode(HttpStatus.CREATED)
  @Permissions(AdminPermissions.ADD_ADMIN)
  @UseGuards(AuthGuard('jwt-admin-access'))
  @Post('/add_admin')
  async addAdmin(
    @GetAdminUser('sub') adminId: string,
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<Partial<AdminUser>> {
    const isEmailExist = await this.adminManageService.isEmailExist(
      createAdminDto.email,
    );
    if (isEmailExist) {
      throw new ConflictException('User with this email already exist');
    }

    const admin = await this.adminManageService.create(createAdminDto, adminId);
    admin.lastLoginAt = 'now()';
    await admin.save();

    return admin.publicView();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessAdminGuard)
  @UseGuards(AuthGuard('jwt-admin-access'))
  @Delete('/remove_admin/:admin_id')
  async removeAdmin(
    @Param('admin_id', ParseUUIDPipe) removedAdminId: string,
  ): Promise<MessageDto> {
    await this.adminManageService.delete(removedAdminId);

    return { message: 'ok' };
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/set_password')
  async setPassword(
    @Query('email') adminEmail: string,
    @Body() setPasswordDto: SetPasswordDto,
  ): Promise<MessageDto> {
    await this.adminManageService.setPassword(adminEmail, setPasswordDto);

    return { message: 'ok' };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessAdminGuard)
  @UseGuards(AuthGuard('jwt-admin-access'))
  @Patch('/:admin_id/change_permissions')
  async changePermissions(
    @Param('admin_id', ParseUUIDPipe) adminId: string,
    @Body() changePermissionsDto: ChangePermissionsDto,
  ): Promise<MessageDto> {
    await this.adminManageService.changePermissions(
      adminId,
      changePermissionsDto,
    );

    return { message: 'ok' };
  }
}
