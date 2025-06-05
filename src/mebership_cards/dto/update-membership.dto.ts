import { ApiProperty } from '@nestjs/swagger';
import { MembershipStatus } from '@/mebership_cards/dto/create-membership.dto';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class UpdateMembershipCardDto {
  // @ApiProperty({
  //   description: 'The ID of the membership card',
  //   example: 1,
  // })
  // @IsInt()
  // @IsPositive()
  // card_id: number;

  @ApiProperty({
    description: 'The ID of the customer',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  customer_id?: number;

  @ApiProperty({
    description: 'The ID of the package associated with the membership card',
    example: 2,
    required: false,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  package_id?: number;

  @ApiProperty({
    description: 'The start date of the membership card',
    example: '2023-06-01T00:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({
    description: 'The end date of the membership card',
    example: '2024-06-01T00:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiProperty({
    description: 'The status of the membership card',
    enum: MembershipStatus,
    example: MembershipStatus.EXPIRED,
    required: false,
  })
  @IsEnum(MembershipStatus)
  @IsOptional()
  status?: MembershipStatus;
}
