import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentOption } from '../entities/payment-option.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { EnablePaymentDto } from '../dto/enable-payment.dto';

@Injectable()
export class PaymentOauthService {
  constructor(
    @InjectRepository(PaymentOption)
    private readonly paymentOptionRepository: Repository<PaymentOption>,
  ) {}

  getAllOptions(): Promise<PaymentOption[]> {
    return this.paymentOptionRepository.find();
  }

  async findOneOrFail(
    findOptions: FindOptionsWhere<PaymentOption>,
  ): Promise<PaymentOption> {
    const payment = await this.paymentOptionRepository.findOneBy(findOptions);
    if (!payment) {
      throw new NotFoundException('Payment option not found');
    }

    return payment;
  }

  async enableOption(
    optionId: string,
    enableDto: EnablePaymentDto,
  ): Promise<PaymentOption> {
    const payment = await this.findOneOrFail({ id: optionId });

    payment.enabled = true;
    payment.credentials =
      JSON.parse(enableDto.credentials) ?? payment.credentials;

    return payment.save();
  }

  async disableOption(optionId: string): Promise<PaymentOption> {
    const payment = await this.findOneOrFail({ id: optionId });

    payment.enabled = false;

    return payment.save();
  }

  async checkCredentials(
    id: string,
    credentials: Record<string, string>,
  ): Promise<never | boolean> {
    const option = await this.findOneOrFail({ id });

    if (option.name === 'yookassa') {
      this.checkYookassaCredentials(credentials);
    }

    return true;
  }

  private checkYookassaCredentials(credentials: Record<string, string>) {
    if (!('storeID' in credentials)) {
      throw new BadRequestException('You need provide storeID in credentials');
    } else if (!('secretKey' in credentials)) {
      throw new BadRequestException(
        'You need provide secretKey in credentials',
      );
    }

    return true;
  }
}
