import { JwtAuthGuard } from '@/auth/guards/ jwt-auth.guard';
import { Roles } from '@/auth/guards/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import { UserRole } from '@/auth/guards/roles/user.roles';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { EquipmentsService } from './equipments.service';
import { CreateEquipmentDto } from '@/equipments/dto/create-equipment.dto';
import { UpdateEquipmentDto } from '@/equipments/dto/update-equipment.dto';

@ApiTags('Equipments')
@UseInterceptors(ResponseInterceptor)
@Controller('equipments')
export class EquipmentsController {
  constructor(private readonly equipmentsService: EquipmentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-all-equipments')
  async getAllEquipments() {
    return await this.equipmentsService.getAllEquipments();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-equipment-by-id/:equipment_id')
  @ApiParam({
    name: 'equipment_id',
    description: 'Equipment ID',
  })
  async getEquipmentById(
    @Param('equipment_id', ParseIntPipe) equipment_id: number,
  ) {
    return await this.equipmentsService.getEquipmentById(equipment_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN)
  @Post('create-equipment')
  async createEquipment(@Body() createEquipmentDto: CreateEquipmentDto) {
    return await this.equipmentsService.createEquipment(createEquipmentDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN)
  @Put('update-equipment/:equipment_id')
  @ApiParam({
    name: 'equipment_id',
    description: 'Equipment ID',
  })
  async updateEquipment(
    @Param('equipment_id', ParseIntPipe) equipment_id: number,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ) {
    return await this.equipmentsService.updateEquipment(
      equipment_id,
      updateEquipmentDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN)
  @Delete('delete-equipment/:equipment_id')
  @ApiParam({
    name: 'equipment_id',
    description: 'Equipment ID',
  })
  async deleteEquipment(
    @Param('equipment_id', ParseIntPipe) equipment_id: number,
  ) {
    return await this.equipmentsService.deleteEquipment(equipment_id);
  }
}
