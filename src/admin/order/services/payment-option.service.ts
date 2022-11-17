import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentOption } from '@core/entities/payment-option.entity';
import { Repository } from 'typeorm';
import { EnablePaymentDto } from '../dto/enable-payment.dto';
import { PaymentOptionService } from '@core/services/payment-option.service';

@Injectable()
export class AdminPaymentOptionService {
  constructor(
    @InjectRepository(PaymentOption)
    private readonly paymentOptionRepository: Repository<PaymentOption>,
    private readonly paymentOptionService: PaymentOptionService,
  ) {}

  async enableOption(
    optionId: string,
    enableDto: EnablePaymentDto,
  ): Promise<PaymentOption> {
    const payment = await this.paymentOptionService.findOneOrFail({
      id: optionId,
    });

    payment.enabled = true;
    payment.credentials =
      JSON.parse(enableDto.credentials) ?? payment.credentials;

    return payment.save();
  }

  async disableOption(optionId: string): Promise<PaymentOption> {
    const payment = await this.paymentOptionService.findOneOrFail({
      id: optionId,
    });

    payment.enabled = false;

    return payment.save();
  }

  async checkCredentials(
    id: string,
    credentials: Record<string, string>,
  ): Promise<never | boolean> {
    const option = await this.paymentOptionService.findOneOrFail({ id });

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
