import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVars } from '../../../config/environment-vars';
import { JwtService } from '@nestjs/jwt';
import { IsNull, Not, Repository } from 'typeorm';
import { adminNotFound } from '../../../admin/auth/errors';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { ClientTokensDto } from '../dto/tokens.dto';

@Injectable()
export class ClientAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService<EnvironmentVars>,
    private readonly jwtService: JwtService,
  ) {}

  async getTokens(userId: string): Promise<ClientTokensDto> {
    const access = this.jwtService.signAsync(
      { sub: userId },
      {
        expiresIn: 60 * 5, // 5 minutes
        secret: this.configService.get('JWT_CLIENT_ACCESS_SECRET'),
      },
    );

    const refresh = this.jwtService.signAsync(
      { sub: userId },
      {
        expiresIn: 60 * 60 * 24, // 1 day
        secret: this.configService.get('JWT_CLIENT_REFRESH_SECRET'),
      },
    );

    const [accessToken, refreshToken] = await Promise.all([access, refresh]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string): Promise<User> {
    const [user] = await this.userRepository.findBy({
      id: userId,
      hashedRefreshToken: Not(IsNull()),
    });

    if (!user) {
      throw new NotFoundException(adminNotFound);
    }

    user.hashedRefreshToken = null;
    return user.save();
  }

  // private async getTokens(userId: string, email: string): Promise<TokensDto> {
  //   const access = this.jwtService.signAsync(
  //     { sub: userId, email },
  //     {
  //       expiresIn: 60 * 5, // 5 minutes
  //       secret: this.configService.get('JWT_ADMIN_ACCESS_SECRET'),
  //     },
  //   );
  //
  //   const refresh = this.jwtService.signAsync(
  //     { sub: userId, email },
  //     {
  //       expiresIn: 60 * 60 * 24, // 1 day
  //       secret: this.configService.get('JWT_ADMIN_REFRESH_SECRET'),
  //     },
  //   );
  //
  //   const [accessToken, refreshToken] = await Promise.all([access, refresh]);
  //   return {
  //     accessToken,
  //     refreshToken,
  //   };
  // }
  //
  // async refreshAuth(
  //   userId: string,
  //   refreshToken: string,
  // ): Promise<TokensDto> {
  //   const adminUser = await this.adminUserRepository.findOneByOrFail({
  //     id: userId,
  //   });
  //   const compareRes = await adminUser.validateRefreshToken(refreshToken);
  //
  //   if (!compareRes) {
  //     throw new UnauthorizedException('Refresh token is invalid');
  //   }
  //
  //   const tokens = await this.getTokens(adminUser.id, adminUser.email);
  //   adminUser.hashedRefreshToken = tokens.refreshToken;
  //   await adminUser.save();
  //
  //   return tokens;
  // }
}
