import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum EquipmentStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  BROKEN = 'BROKEN',
}

export class CreateEquipmentDto {
  @ApiPropertyOptional({
    example: 'Treadmill X3000',
    description: 'Name of the equipment',
  })
  @IsOptional()
  @IsString()
  equipment_name?: string;

  @ApiPropertyOptional({
    example: 'Cardio machine with heart rate sensors',
    description: 'Detailed description of the equipment',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Room 2 - 3rd floor - Cardio zone - Brand: BodyShape - District 1',
    description: 'Current physical location of the equipment',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: EquipmentStatus.ACTIVE,
    enum: EquipmentStatus,
    description: 'Current status of the equipment',
  })
  @IsOptional()
  @IsEnum(EquipmentStatus)
  status?: EquipmentStatus;

  @IsOptional()
  @IsDateString()
  created_at: string;

  @IsOptional()
  @IsDateString()
  last_maintenance_date?: string;
}
