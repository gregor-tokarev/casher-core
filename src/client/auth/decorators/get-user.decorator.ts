import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ClientJwtPayloadDto } from '../dto/jwt-payload.dto';

export const GetClientUser = createParamDecorator(
  (
    data: keyof ClientJwtPayloadDto | undefined,
    context: ExecutionContext,
  ): string | number | ClientJwtPayloadDto => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as ClientJwtPayloadDto;
    return data ? user[data] : user;
  },
);
