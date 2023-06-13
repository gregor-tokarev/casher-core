import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateFirstAdminDto } from '../dto/create-first-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVars } from '@config/environment-vars';
import { AdminTokensDto } from '../dto/tokens.dto';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { AdminAuthManageService } from './manage.service';
import { MessageDto } from '@core/dto/message.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly adminManageService: AdminAuthManageService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVars>,
  ) {}

  async signup(createAdminDto: CreateFirstAdminDto): Promise<AdminTokensDto> {
    const adminUser = await this.adminManageService.create(createAdminDto);
    const tokens = await this.getTokens(adminUser.id, adminUser.email);

    adminUser.hashedRefreshToken = tokens.refreshToken;
    adminUser.lastLoginAt = 'now()';
    await adminUser.save();

    return tokens;
  }

  async login(
    loginAdminDto: LoginAdminDto,
  ): Promise<AdminTokensDto | MessageDto> {
    const adminUser = await this.adminManageService.findByOrFail({
      email: loginAdminDto.email,
    });

    if (!adminUser.password) {
      return { message: 'set password' };
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

  private async getTokens(
    userId: string,
    email: string,
  ): Promise<AdminTokensDto> {
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
   * @param adminId - id of user that request new tokens
   * @param refreshToken - current refresh token of this user
   */
  public async refreshAuth(
    adminId: string,
    refreshToken: string,
  ): Promise<AdminTokensDto> {
    const adminUser = await this.adminManageService.findByOrFail({
      id: adminId,
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
