import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Cart } from './entities/cart.entity';
import { ClientCartService } from './services/cart.service';
import { GetClientUser } from '../auth/decorators/get-user.decorator';
import { ManageProductsDto } from './dto/manage-products.dto';
import { OkDto } from '@core/dto/ok.dto';

@UseGuards(AuthGuard('jwt-client-access'))
@Controller('client/cart')
export class CartController {
  constructor(private readonly clientCartService: ClientCartService) {}

  @Get()
  async getCart(@GetClientUser('sub') userId: string): Promise<Cart> {
    return this.clientCartService.findOneOrFail({ owner: { id: userId } });
  }

  @Post('add_products')
  async addProducts(
    @GetClientUser('sub') userId: string,
    @Body() manageProductsDto: ManageProductsDto,
  ): Promise<OkDto> {
    const cart = await this.clientCartService.findOneOrFail({
      owner: { id: userId },
    });

    await this.clientCartService.addProducts(cart.id, manageProductsDto);

    return { message: 'ok' };
  }

  @Post('remove_products')
  async removeProducts(
    @GetClientUser('sub') userId: string,
    @Body() manageProductsDto: ManageProductsDto,
  ): Promise<OkDto> {
    const cart = await this.clientCartService.findOneOrFail({
      owner: { id: userId },
    });

    await this.clientCartService.removeProducts(cart.id, manageProductsDto);

    return { message: 'ok' };
  }
}
