import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadDto } from '../../../core/dto/jwt-payload.dto';

export const GetUser = createParamDecorator(
  (
    data: keyof JwtPayloadDto | undefined,
    context: ExecutionContext,
  ): string | number | JwtPayloadDto => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as JwtPayloadDto;
    return data ? user[data] : user;
  },
);
