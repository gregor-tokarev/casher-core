import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserOauth } from '../../entities/user-oauth.entity';

@Injectable()
export class ClientAuthManageService {
  constructor(
    @InjectRepository(User)
    private readonly clientUserRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.sex = createUserDto.sex;
    user.name = createUserDto.name;
    user.surname = createUserDto.surname;
    user.avatarUrl = createUserDto.avatarUrl;

    const savedUser = await user.save();

    if (createUserDto.oauth) {
      const oauth = new UserOauth();
      oauth.email = createUserDto.oauth.email;
      oauth.provider = createUserDto.oauth.provider;
      oauth.refreshToken = createUserDto.oauth.refreshToken;
      oauth.user = savedUser;

      await oauth.save();
    }

    return savedUser;
  }
}
