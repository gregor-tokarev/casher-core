import { Injectable } from '@nestjs/common';
import { PaymentOptionService } from '@core/services/payment-option.service';
import { Payment, YooCheckout } from '@a2seven/yoo-checkout';
import { OrderService } from '@core/services/order.service';
import { Product } from '@core/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderYookassaPayment } from '../entities/order-yookassa-payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class YookassaService {
  constructor(
    @InjectRepository(OrderYookassaPayment)
    private readonly orderYookassaPaymentRepository: Repository<OrderYookassaPayment>,
    private readonly paymentOptionService: PaymentOptionService,
    private readonly orderService: OrderService,
  ) {}

  private yooCheckout: YooCheckout;

  currencyMap: Record<Product['priceCurrency'], string> = {
    dollar: 'USD',
    ruble: 'RUB',
  };

  async init(): Promise<void> {
    if (this.yooCheckout) {
      return;
    }

    const { credentials } = await this.paymentOptionService.findOneOrFail({
      name: 'yookassa',
    });

    this.yooCheckout = new YooCheckout({
      shopId: credentials.storeID,
      secretKey: credentials.secretKey,
    });
  }

  async createPayment(orderId: string, redirect: string): Promise<Payment> {
    await this.init();

    const order = await this.orderService.findOneOrFail({ id: orderId });
    const price = order.calculatePrice();

    const payment = await this.yooCheckout.createPayment({
      amount: {
        currency: this.currencyMap[order.orderCurrency],
        value: price.toString(),
      },
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: redirect,
      },
    });

    const link = new OrderYookassaPayment();
    link.paymentId = payment.id;
    link.orderId = orderId;
    await link.save();

    return payment;
  }

  async capturePayment(paymentId: string): Promise<Payment> {
    await this.init();

    return this.yooCheckout.capturePayment(paymentId, {});
  }

  async getPaymentByOrder(orderId: string): Promise<Payment> {
    await this.init();

    const { paymentId } = await this.orderYookassaPaymentRepository.findOneBy({
      orderId,
    });
    return this.yooCheckout.getPayment(paymentId);
  }
}
