import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVars } from '@config/environment-vars';
import { JwtService } from '@nestjs/jwt';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { ClientTokensDto } from '../dto/tokens.dto';
import { UserManageService } from './manage.service';

@Injectable()
export class ClientAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService<EnvironmentVars>,
    private readonly jwtService: JwtService,
    private readonly userManageService: UserManageService,
  ) {}

  async getTokens(userId: string): Promise<ClientTokensDto> {
    const access = this.jwtService.signAsync(
      { sub: userId },
      {
        expiresIn: 60 * 60, // 1 hour
        secret: this.configService.get('JWT_CLIENT_ACCESS_SECRET'),
      },
    );

    const refresh = this.jwtService.signAsync(
      { sub: userId },
      {
        expiresIn: 60 * 60 * 24 * 14, // 2 weeks
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
      throw new NotFoundException('Admin not found');
    }

    user.hashedRefreshToken = null;
    return user.save();
  }

  async refreshAuth(
    userId: string,
    refreshToken: string,
  ): Promise<ClientTokensDto> {
    const user = await this.userManageService.findOneOrFail({ id: userId });
    const compareRes = await user.validateRefreshToken(refreshToken);

    if (!compareRes) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    const tokens = await this.getTokens(user.id);
    user.hashedRefreshToken = tokens.refreshToken;
    await user.save();

    return tokens;
  }
}
