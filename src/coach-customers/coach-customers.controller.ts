import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoachCustomersService } from './coach-customers.service';

@ApiTags('CoachCustomers')
@UseInterceptors(ResponseInterceptor)
@Controller('coach-customers')
export class CoachCustomersController {
  constructor(private readonly coachCustomersService: CoachCustomersService) {}

  
}
