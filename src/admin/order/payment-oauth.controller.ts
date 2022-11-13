import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OauthOption } from '@core/entities/oauth-option.entity';
import { EnableOauthDto } from '../users/dto/enable-oauth.dto';
import { OkDto } from '@core/dto/ok.dto';
import { PaymentOauthService } from './services/payment-oauth.service';

@UseGuards(AuthGuard('jwt-admin-access'))
@Controller('admin/payment')
export class PaymentOauthController {
  constructor(private readonly paymentOauthService: PaymentOauthService) {}

  @Get('/option')
  getAllOauthOptions(): Promise<OauthOption[]> {
    return this.paymentOauthService.getAllOptions();
  }

  @Post('/option/:option_id/enable')
  async enableOption(
    @Param('option_id', ParseUUIDPipe) optionId: string,
    @Body() enableDto: EnableOauthDto,
  ): Promise<OkDto> {
    await this.paymentOauthService.checkCredentials(
      optionId,
      JSON.parse(enableDto.credentials),
    );

    await this.paymentOauthService.enableOption(optionId, enableDto);

    return { message: 'ok' };
  }

  @Post('/option/:option_id/disable')
  async disableOption(
    @Param('option_id', ParseUUIDPipe) optionId: string,
  ): Promise<OkDto> {
    await this.paymentOauthService.disableOption(optionId);

    return { message: 'ok' };
  }
}
