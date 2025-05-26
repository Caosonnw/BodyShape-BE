import { Controller, UseInterceptors } from '@nestjs/common';
import { MebershipCardsService } from './mebership_cards.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';

@ApiTags('Mebership Cards')
@UseInterceptors(ResponseInterceptor)
@Controller('mebership-cards')
export class MebershipCardsController {
  constructor(private readonly mebershipCardsService: MebershipCardsService) {}
}
