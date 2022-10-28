import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserOauth } from '../../entities/user-oauth.entity';

@Injectable()
export class ClientAuthManageService {
  constructor(
    @InjectRepository(User)
    private readonly clientUserRepository: Repository<User>,
  ) {}

  async findByOrFail(findOptions: FindOptionsWhere<User>): Promise<User> {
    const user = await this.clientUserRepository.findOneBy(findOptions);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async findBy(findOptions: FindOptionsWhere<User>): Promise<User> {
    return this.clientUserRepository.findOneBy(findOptions);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.sex = createUserDto.sex;
    user.name = createUserDto.name;
    user.surname = createUserDto.surname;
    user.avatarUrl = createUserDto.avatarUrl;

    if (createUserDto.oauth) {
      const oauth = new UserOauth();
      oauth.email = createUserDto.oauth.email;
      oauth.provider = createUserDto.oauth.provider;
      oauth.providerId = createUserDto.oauth.providerId;
      oauth.token = createUserDto.oauth.token;

      user.oauth = oauth;
    }

    return await user.save();
  }
}
