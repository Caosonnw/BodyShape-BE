import { JwtAuthGuard } from '@/auth/guards/ jwt-auth.guard';
import { Roles } from '@/auth/guards/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import { UserRole } from '@/auth/guards/roles/user.roles';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { Response } from '@/utils/utils';
import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CoachCustomersService } from './coach-customers.service';
import { Body } from '@nestjs/common';
import { CreateCoachCustomerDto } from '@/coach-customers/dto/create-coach-customer.dto';
import { UpdateCoachCustomerDto } from '@/coach-customers/dto/update-coach-customer.dto';
import { DeleteCoachCustomerDto } from '@/coach-customers/dto/delete-coach-customer.dto';

@ApiTags('CoachCustomers')
@UseInterceptors(ResponseInterceptor)
@Controller('coach-customers')
export class CoachCustomersController {
  constructor(private readonly coachCustomersService: CoachCustomersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-all-coach-customers')
  async getAllCoachCustomers() {
    return await this.coachCustomersService.getAllCoachCustomers();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-coach-customers')
  async getCoachCustomers(@Req() req) {
    const userId = req.user.user_id;
    if (userId) {
      return this.coachCustomersService.getCoachCustomers(userId);
    } else {
      return Response('No user found!', HttpStatus.NOT_FOUND);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-coach-customers-by-id/:coach_id/:customer_id')
  @ApiParam({
    name: 'coach_id',
    description: 'ID of the coach',
  })
  @ApiParam({
    name: 'customer_id',
    description: 'ID of the customer',
  })
  async getCoachCustomersById(
    @Param('coach_id', ParseIntPipe) coach_id: number,
    @Param('customer_id', ParseIntPipe) customer_id: number,
  ) {
    return this.coachCustomersService.getCoachCustomersById(
      coach_id,
      customer_id,
    );
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Post('create-coach-customer')
  async createCoachCustomer(@Body() body: CreateCoachCustomerDto) {
    const { coach_id, customer_id } = body;
    return this.coachCustomersService.createCoachCustomer(
      coach_id,
      customer_id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Put('update-coach-customer')
  async updateCoachCustomer(@Body() body: UpdateCoachCustomerDto) {
    const { oldCoachId, oldCustomerId, newCoachId, newCustomerId } = body;
    return this.coachCustomersService.updateCoachCustomer(
      oldCoachId,
      oldCustomerId,
      newCoachId,
      newCustomerId,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Delete('delete-coach-customer')
  async deleteCoachCustomer(@Body() body: DeleteCoachCustomerDto) {
    const { coach_id, customer_id } = body;
    return this.coachCustomersService.deleteCoachCustomer(
      coach_id,
      customer_id,
    );
  }
}
