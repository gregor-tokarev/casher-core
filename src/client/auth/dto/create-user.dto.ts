import { UserOauth } from '../../entities/user-oauth.entity';
import { User } from '@core/entities/user.entity';

export class CreateUserDto {
  name: string;
  surname: string;
  avatarUrl: string;
  sex?: User['sex'];

  oauth?: {
    provider: UserOauth['provider'];
    providerId: string;
    email: string;
    token: string;
  };
}
