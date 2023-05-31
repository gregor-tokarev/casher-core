import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserOauth } from '../../entities/user-oauth.entity';
import { ClientCartService } from '../../cart/services/cart.service';
import { User } from '@core/entities/user.entity';

@Injectable()
export class UserManageService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly clientCartService: ClientCartService,
  ) {}

  async findOneOrFail(findOptions: FindOptionsWhere<User>): Promise<User> {
    const user = await this.userRepository.findOneBy(findOptions);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findBy(findOptions: FindOptionsWhere<User>): Promise<User> {
    return this.userRepository.findOneBy(findOptions);
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

    const savedUser = await user.save();
    await this.clientCartService.create(savedUser.id);

    return savedUser;
  }
}
