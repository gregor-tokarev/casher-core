import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DeleteResult, IsNull, Not, Repository } from 'typeorm';
import { AdminPermissions, AdminUser } from '../../entities/admin-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFirstAdminDto } from '../dto/create-first-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnviromentVars } from '../../../config/enviroment-vars';
import { TokensDto } from '../dto/tokens.dto';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { SetPasswordDto } from '../dto/set-password.dto';
import { adminNotFound } from '../errors';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnviromentVars>,
  ) {}

  async checkEmpty(): Promise<boolean> {
    const adminCount = await this.adminUserRepository.count();
    return adminCount === 0;
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

  async removeById(id: string): Promise<DeleteResult> {
    return this.adminUserRepository.delete({ id });
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

  async signup(createAdminDto: CreateFirstAdminDto): Promise<TokensDto> {
    const adminUser = await this.create(createAdminDto);
    const tokens = await this.getTokens(adminUser.id, adminUser.email);

    adminUser.hashedRefreshToken = tokens.refreshToken;
    adminUser.lastLoginAt = 'now()';
    await adminUser.save();

    return tokens;
  }

  async login(loginAdminDto: LoginAdminDto): Promise<TokensDto> {
    const adminUser = await this.adminUserRepository.findOneBy({
      email: loginAdminDto.email,
    });
    if (!adminUser) {
      throw new NotFoundException(adminNotFound);
    }

    const isRightPass = adminUser.validatePassword(loginAdminDto.password);
    if (!isRightPass) {
      throw new UnauthorizedException('Incorrect password');
    }

    adminUser.lastLoginAt = 'now()';

    const tokens = await this.getTokens(adminUser.id, adminUser.email);
    adminUser.hashedRefreshToken = tokens.refreshToken;
    await adminUser.save();

    return tokens;
  }

  async logout(adminId: string): Promise<AdminUser> {
    const [admin] = await this.adminUserRepository.findBy({
      id: adminId,
      hashedRefreshToken: Not(IsNull()),
    });

    if (!admin) {
      throw new NotFoundException(adminNotFound);
    }

    admin.hashedRefreshToken = null;
    return admin.save();
  }

  private async getTokens(userId: string, email: string): Promise<TokensDto> {
    const access = this.jwtService.signAsync(
      { sub: userId, email },
      {
        expiresIn: 60 * 5, // 5 minutes
        secret: this.configService.get('JWT_ADMIN_ACCESS_SECRET'),
      },
    );

    const refresh = this.jwtService.signAsync(
      { sub: userId, email },
      {
        expiresIn: 60 * 60 * 24, // 1 day
        secret: this.configService.get('JWT_ADMIN_REFRESH_SECRET'),
      },
    );

    const [accessToken, refreshToken] = await Promise.all([access, refresh]);
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Search for user in db
   * validate his token and generate a new pair of tokens
   *
   * @param userId - id of user that request new tokens
   * @param refreshToken - current refresh token of this user
   */
  public async refreshAuth(
    userId: string,
    refreshToken: string,
  ): Promise<TokensDto> {
    const adminUser = await this.adminUserRepository.findOneByOrFail({
      id: userId,
    });
    const compareRes = await adminUser.validateRefreshToken(refreshToken);

    if (!compareRes) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    const tokens = await this.getTokens(adminUser.id, adminUser.email);
    adminUser.hashedRefreshToken = tokens.refreshToken;
    await adminUser.save();

    return tokens;
  }
}
