import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientOauthOption } from '../../../core/entities/oauth-option.entity';
import { Repository } from 'typeorm';
import { EnableOauthDto } from '../dto/enable-oauth.dto';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(ClientOauthOption)
    private readonly oauthCredentialsRepository: Repository<ClientOauthOption>,
  ) {}

  async getAllOauthOptions(): Promise<ClientOauthOption[]> {
    return this.oauthCredentialsRepository.find();
  }

  async findById(id: string): Promise<ClientOauthOption> {
    const option = await this.oauthCredentialsRepository.findOneBy({ id });
    if (!option) {
      throw new NotFoundException('option not found');
    }

    return option;
  }

  async enableOauthOption(
    oauthId: string,
    toggleDto: EnableOauthDto,
  ): Promise<ClientOauthOption> {
    const option = await this.findById(oauthId);
    option.enabled = true;
    option.credentials =
      JSON.parse(toggleDto.credentials) ?? option.credentials;

    return option.save();
  }

  async disableOauthOption(oauthId: string): Promise<ClientOauthOption> {
    const option = await this.findById(oauthId);
    option.enabled = false;

    return option.save();
  }

  async restartServer() {
    process.exit(0);
  }

  async checkCredentials(
    id: string,
    credentials: Record<string, string>,
  ): Promise<never | boolean> {
    const option = await this.findById(id);

    if (option.name === 'vk') {
      this.checkVkCredentials(credentials);
    } else if (option.name === 'telegram') {
      this.checkTelegramCredentials(credentials);
    } else if (option.name === 'mailru') {
      this.checkMailruCredentials(credentials);
    } else if (option.name === 'rambler') {
      this.checkRamblerCredentials(credentials);
    } else if (option.name === 'yandex') {
      this.checkYandexCredentials(credentials);
    }

    return true;
  }

  checkVkCredentials(credentials: Record<string, string>): never | boolean {
    if (!('clientID' in credentials)) {
      throw new BadRequestException('You need provide clientID in credentials');
    } else if (!('clientSecret' in credentials)) {
      throw new BadRequestException(
        'You need provide clientSecret in credentials',
      );
    }

    return true;
  }

  private checkTelegramCredentials(credentials: Record<string, string>) {
    // TODO
  }

  private checkMailruCredentials(credentials: Record<string, string>) {
    // TODO
  }

  private checkRamblerCredentials(credentials: Record<string, string>) {
    // TODO
  }

  private checkYandexCredentials(credentials: Record<string, string>) {
    if (!('clientID' in credentials)) {
      throw new BadRequestException('You need provide clientID in credentials');
    } else if (!('clientSecret' in credentials)) {
      throw new BadRequestException(
        'You need provide clientSecret in credentials',
      );
    }

    return true;
  }
}
