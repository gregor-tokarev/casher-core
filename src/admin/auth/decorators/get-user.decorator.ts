import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminJwtPayloadDto } from '../dto/jwt-payload.dto';

export const GetAdminUser = createParamDecorator(
  (
    data: keyof AdminJwtPayloadDto | undefined,
    context: ExecutionContext,
  ): string | number | AdminJwtPayloadDto => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as AdminJwtPayloadDto;
    return data ? user[data] : user;
  },
);
