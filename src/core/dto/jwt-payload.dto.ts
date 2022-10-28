export class JwtPayloadDto {
  /**
   * user id
   */
  sub: string;

  /**
   * user email
   */
  email: string;

  /**
   * timestamp of token creation
   */
  iat: number;

  /**
   * timestamp of token expiration
   */
  exp: number;
}
