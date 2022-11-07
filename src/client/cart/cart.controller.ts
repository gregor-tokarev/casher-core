import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Cart } from './entities/cart.entity';
import { ClientCartService } from './services/cart.service';
import { GetClientUser } from '../auth/decorators/get-user.decorator';
import { ManageProductsDto } from './dto/manage-products.dto';
import { OkDto } from '@core/dto/ok.dto';
import { SetCountDto } from './dto/set-count.dto';
import { CountDto } from './dto/count.dto';

@UseGuards(AuthGuard('jwt-client-access'))
@Controller('client/cart')
export class CartController {
  constructor(private readonly clientCartService: ClientCartService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getCart(@GetClientUser('sub') userId: string): Promise<Cart> {
    return this.clientCartService.findOneOrFail({ owner: { id: userId } });
  }

  @HttpCode(HttpStatus.CREATED)
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

  @HttpCode(HttpStatus.OK)
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

  @HttpCode(HttpStatus.OK)
  @Get(':product_id/count')
  async getProductCount(
    @Param('product_id', ParseUUIDPipe) productId: string,
  ): Promise<CountDto> {
    const { count } = await this.clientCartService.getRelationByProductId(
      productId,
    );

    return { count };
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':product_id/set_count')
  async setProductCount(
    @GetClientUser('sub') userId: string,
    @Param('product_id', ParseUUIDPipe) productId: string,
    @Body() setCountDto: SetCountDto,
  ): Promise<CountDto> {
    if (setCountDto.count === 0) {
      const cart = await this.clientCartService.findOneOrFail({
        owner: { id: userId },
      });

      await this.clientCartService.removeProducts(cart.id, {
        products: [productId],
      });

      return { count: 0 };
    }
    const { count } = await this.clientCartService.setProductCount(
      productId,
      setCountDto,
    );

    return { count };
  }
}
