import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { EnvironmentVars } from '@config/environment-vars';
import { AdminJwtPayloadDto } from '../dto/jwt-payload.dto';

/**
 * Strategy to extract and validate access token from headers
 * used for auth in most routes
 */
@Injectable()
export class AdminRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-admin-refresh',
) {
  /**
   * Setting Base jwt strategy
   * @link Strategy
   *
   * @param configService - to get variables from env file
   */
  constructor(private configService: ConfigService<EnvironmentVars>) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      secretOrKey: configService.get('JWT_ADMIN_REFRESH_SECRET'),
    });
  }

  /**
   * Set req.user in return statement
   * In this case don't use any transformations
   *
   * @param payload - extracted token info
   */
  public validate(payload: AdminJwtPayloadDto) {
    return payload;
  }
}
