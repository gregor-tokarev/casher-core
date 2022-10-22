import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

export const GetUser = createParamDecorator(
  (
    data: string | undefined,
    context: ExecutionContext,
  ): JwtPayloadDto | keyof JwtPayloadDto => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as JwtPayloadDto;
    return data ? user[data] : user;
  },
);
