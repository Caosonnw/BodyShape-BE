import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsEnum,
  IsOptional,
  IsDateString,
  IsPositive,
} from 'class-validator';

export enum MembershipStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

export class CreateMembershipCardDto {
  @ApiProperty({
    description: 'The ID of the customer',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  customer_id: number;

  @ApiProperty({
    description: 'The ID of the package associated with the membership card',
    example: 2,
  })
  @IsInt()
  @IsPositive()
  package_id: number;

  @ApiProperty({
    description: 'The start date of the membership card',
    example: '2023-06-01T00:00:00.000Z',
  })
  @IsDateString()
  start_date: string;

  @IsDateString()
  @IsOptional()
  end_date: string;

  @ApiProperty({
    description: 'The status of the membership card',
    enum: MembershipStatus,
    example: MembershipStatus.ACTIVE,
  })
  @IsEnum(MembershipStatus)
  status: MembershipStatus;
}
