import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientOauthOption } from '../entities/oauth-option.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class OauthOptionService {
  constructor(
    @InjectRepository(ClientOauthOption)
    private readonly clientOauthOptionRepository: Repository<ClientOauthOption>,
  ) {}

  async getAll(): Promise<ClientOauthOption[]> {
    return this.clientOauthOptionRepository.find();
  }

  async findBy(
    findOptions: FindOptionsWhere<ClientOauthOption>,
  ): Promise<ClientOauthOption> {
    const option = await this.clientOauthOptionRepository.findOneBy(
      findOptions,
    );
    if (!option) {
      throw new NotFoundException('oauth option not found');
    }

    return option;
  }
}
