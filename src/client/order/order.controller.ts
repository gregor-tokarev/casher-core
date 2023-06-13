import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentOptionService } from '@core/services/payment-option.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { YookassaService } from './services/yookassa.service';
import { GetClientUser } from '../auth/decorators/get-user.decorator';
import { ClientOrderService } from './services/order.service';
import { ClientCartService } from '../cart/services/cart.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVars } from '@config/environment-vars';
import { CreateOrderDto } from './dto/create-order.dto';
import { Payment } from '@a2seven/yoo-checkout';
import { MessageDto } from '@core/dto/message.dto';
import { OrderService } from '@core/services/order.service';

@Controller('client/order')
export class OrderController {
  constructor(
    private readonly paymentOptionService: PaymentOptionService,
    private readonly yookassaService: YookassaService,
    private readonly clientOrderService: ClientOrderService,
    private readonly orderService: OrderService,
    private readonly clientCartService: ClientCartService,
    private readonly configService: ConfigService<EnvironmentVars>,
  ) {}

  @UseGuards(AuthGuard('jwt-client-access'))
  @Post('/create')
  async makeOrder(
    @Req() req: Request,
    @GetClientUser('sub') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const order = await this.clientOrderService.create(userId, createOrderDto);
    // TODO: add multiple payment
    if (Array.isArray(order)) {
      throw new InternalServerErrorException(
        "Can't process order with multiple currencies",
      );
    }

    const payment = await this.yookassaService.createPayment(
      order.id,
      `${req.protocol}://${req.get('host')}/client/order/${
        order.id
      }/confirm?user_id=${userId}`,
    );

    return { url: payment.confirmation.confirmation_url };
  }

  @Redirect()
  @Get('/:order_id/confirm')
  async confirmPayment(
    @Param('order_id', ParseUUIDPipe) orderId: string,
    @Query('user_id', ParseUUIDPipe) userId: string,
  ) {
    const frontendUrl = this.configService.get('FRONTEND_URL');

    const payment = await this.yookassaService.getPaymentByOrder(orderId);

    if (!payment.paid) {
      throw new BadRequestException('Order not paid');
    } else if (payment.status === 'succeeded') {
      return { url: `${frontendUrl}/order/${orderId}/confirmed` };
    }

    await Promise.all([
      this.clientOrderService.confirm(orderId),
      this.clientCartService.clear(userId, orderId),
    ]);

    return { url: `${frontendUrl}/order/${orderId}/confirmed` };
  }

  @Post('/yookassa-webhook')
  async yookassaWebhook(
    @Body() body: { event: string; type: string; object: Payment },
  ): Promise<MessageDto> {
    if (body.event === 'payment.waiting_for_capture') {
      await this.yookassaService.capturePayment(body.object.id);
      const order = await this.orderService.orderByPayment(body.object.id);

      await Promise.all([
        this.clientOrderService.confirm(order.id),
        this.clientCartService.clear(order.owner.id, order.id),
      ]);
    }

    return { message: 'ok' };
  }
}
