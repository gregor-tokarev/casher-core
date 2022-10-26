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
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthService } from './services/auth.service';
import { TokensDto } from './dto/tokens.dto';
import { CreateFirstAdminDto } from './dto/create-first-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminPermissions, AdminUser } from '../entities/admin-user.entity';
import { Permissions } from './decorators/set-permission.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { OkDto } from '../dto/ok.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { AccessAdminGuard } from './guards/access-admin.guard';
import { ChangePermissionsDto } from './dto/change-permissions.dto';
import { AdminManageService } from './services/manage.service';
import { AllAdminsDto } from './dto/all-admins.dto';

@Controller('admin/auth')
export class AuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly adminManageService: AdminManageService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/add_first')
  async addFirstAdmin(
    @Body() createAdminDto: CreateFirstAdminDto,
  ): Promise<TokensDto> {
    const count = await this.adminManageService.count();
    if (count !== 0) {
      throw new ForbiddenException("You can't add new admin");
    }

    return this.adminAuthService.signup(createAdminDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() body: LoginAdminDto): Promise<TokensDto> {
    return this.adminAuthService.login(body);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-admin-access'))
  @Post('/logout')
  async logout(@GetUser('sub') adminId: string): Promise<OkDto> {
    await this.adminAuthService.logout(adminId);
    return { message: 'ok' };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-admin-access'))
  @Get()
  async getAllAdmins(
    @Query('top', ParseIntPipe) top?: number,
    @Query('skip', ParseIntPipe) skip?: number,
  ): Promise<AllAdminsDto> {
    const admins = await this.adminManageService.findAll(top, skip);
    const count = await this.adminManageService.count();

    return { admins: admins.map((adm) => adm.publicView()), count };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-admin-refresh'))
  @Post('/refresh')
  async refreshToken(
    @GetUser('sub') userId: string,
    @Body('token') refreshToken: string,
  ): Promise<TokensDto> {
    return this.adminAuthService.refreshAuth(userId, refreshToken);
  }

  @HttpCode(HttpStatus.CREATED)
  @Permissions(AdminPermissions.ADD_ADMIN)
  @UseGuards(AuthGuard('jwt-admin-access'))
  @Post('/add_admin')
  async addAdmin(
    @GetUser('sub') adminId: string,
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
  ): Promise<OkDto> {
    await this.adminManageService.delete(removedAdminId);

    return { message: 'ok' };
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/:admin_id/set_password')
  async setPassword(
    @Param('admin_id', ParseUUIDPipe) adminId: string,
    @Body() setPasswordDto: SetPasswordDto,
  ): Promise<OkDto> {
    await this.adminManageService.setPassword(adminId, setPasswordDto);

    return { message: 'ok' };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessAdminGuard)
  @UseGuards(AuthGuard('jwt-admin-access'))
  @Patch('/:admin_id/change_permissions')
  async changePermissions(
    @Param('admin_id', ParseUUIDPipe) adminId: string,
    @Body() changePermissionsDto: ChangePermissionsDto,
  ): Promise<OkDto> {
    await this.adminManageService.changePermissions(
      adminId,
      changePermissionsDto,
    );

    return { message: 'ok' };
  }
}
