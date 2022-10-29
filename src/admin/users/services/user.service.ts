import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OauthOption } from '@core/entities/oauth-option.entity';
import { EnableOauthDto } from '../dto/enable-oauth.dto';
import { OauthOptionService } from '@core/services/oauth-option.service';

@Injectable()
export class AdminUserService {
  constructor(private readonly oauthOptionService: OauthOptionService) {}

  async getAllOauthOptions(): Promise<OauthOption[]> {
    return this.oauthOptionService.getAll();
  }

  async findById(id: string): Promise<OauthOption> {
    const option = await this.oauthOptionService.findBy({ id });
    if (!option) {
      throw new NotFoundException('option not found');
    }

    return option;
  }

  async enableOauthOption(
    oauthId: string,
    toggleDto: EnableOauthDto,
  ): Promise<OauthOption> {
    const option = await this.findById(oauthId);
    option.enabled = true;
    option.credentials =
      JSON.parse(toggleDto.credentials) ?? option.credentials;

    return option.save();
  }

  async disableOauthOption(oauthId: string): Promise<OauthOption> {
    const option = await this.findById(oauthId);
    option.enabled = false;

    return option.save();
  }

  async checkCredentials(
    id: string,
    credentials: Record<string, string>,
  ): Promise<never | boolean> {
    const option = await this.findById(id);

    if (option.name === 'vk') {
      this.checkVkCredentials(credentials);
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
    } else if (!('serviceSecret' in credentials)) {
      throw new BadRequestException(
        'You need to provide serviceSecret in credentials',
      );
    }

    return true;
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
