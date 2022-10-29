import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OauthOption } from '../entities/oauth-option.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class OauthOptionService {
  constructor(
    @InjectRepository(OauthOption)
    private readonly clientOauthOptionRepository: Repository<OauthOption>,
  ) {}

  async getAll(): Promise<OauthOption[]> {
    return this.clientOauthOptionRepository.find();
  }

  async findBy(
    findOptions: FindOptionsWhere<OauthOption>,
  ): Promise<OauthOption> {
    const option = await this.clientOauthOptionRepository.findOneBy(
      findOptions,
    );
    if (!option) {
      throw new NotFoundException('oauth option not found');
    }

    return option;
  }
}
