export class ClientJwtPayloadDto {
  /**
   * user id
   */
  sub: string;

  /**
   * timestamp of token creation
   */
  iat: number;

  /**
   * timestamp of token expiration
   */
  exp: number;
}
