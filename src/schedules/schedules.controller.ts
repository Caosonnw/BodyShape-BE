import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@UseInterceptors(ResponseInterceptor)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}
}
