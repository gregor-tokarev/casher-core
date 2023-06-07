import { User } from '@core/entities/user.entity';

export class UserResponseDto extends User {
  totalOrder: number;
}

export class UsersResponseDto {
  users: UserResponseDto[];
  count: number;
}
