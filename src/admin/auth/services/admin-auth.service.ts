import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AdminUser, AdminPermissions } from '../../entities/admin-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFirstAdminDto } from '../dto/create-first-admin.dto';
import { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnviromentVars } from '../../../config/enviroment-vars';
import { TokensDto } from '../dto/tokens.dto';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';

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
    return this.adminUserRepository.findOneByOrFail({ id });
  }

  async create(
    createAdminDto: CreateFirstAdminDto | CreateAdminDto,
    addedBy?: string,
  ): Promise<AdminUser> {
    const adminUser = new AdminUser();
    adminUser.email = createAdminDto.email;
    if ('password' in createAdminDto)
      adminUser.password = await hash(createAdminDto.password, 10);

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

    adminUser.hashedRefreshToken = await hash(tokens.refreshToken, 10);
    await adminUser.save();

    return tokens;
  }

  async login(loginAdminDto: LoginAdminDto): Promise<TokensDto> {
    const adminUser = await this.adminUserRepository.findOneByOrFail({
      email: loginAdminDto.email,
    });

    const isRightPass = adminUser.validatePassword(loginAdminDto.password);
    if (!isRightPass) {
      throw new UnauthorizedException('Incorrect password');
    }

    adminUser.lastLoginAt = 'now()';

    const tokens = await this.getTokens(adminUser.id, adminUser.email);
    adminUser.hashedRefreshToken = await hash(tokens.refreshToken, 10);
    await adminUser.save();

    return tokens;
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
    adminUser.hashedRefreshToken = await hash(tokens.refreshToken, 10);
    await adminUser.save();

    return tokens;
  }
}
