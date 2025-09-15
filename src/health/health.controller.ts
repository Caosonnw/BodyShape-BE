import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { HealthService } from './health.service';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';

@ApiTags('Health')
@UseInterceptors(ResponseInterceptor)
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiExcludeEndpoint()
  @Post('get-health-from-health-kit/:user_id')
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @ApiBody({ description: 'Health data from HealthKit', type: Object })
  async getHealthFromHealthKit(
    @Param('user_id') user_id: string,
    @Body() healthData: any,
  ) {
    const userId = parseInt(user_id);
    return this.healthService.getHealthFromHealthKit(userId, healthData);
  }

  @Get('get-health-by-user-id/:userId')
  async getHealthByUserId(@Param('userId') user_id: string) {
    const userId = parseInt(user_id);
    return this.healthService.getHealthByUserId(userId);
  }
}
