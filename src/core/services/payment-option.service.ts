import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentOption } from '@core/entities/payment-option.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class PaymentOptionService {
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
}
