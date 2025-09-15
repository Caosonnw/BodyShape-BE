import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateCoachCustomerDto {
  @ApiProperty({
    example: 3,
    description: 'The ID of the coach to assign to the customer.',
  })
  @IsInt()
  coach_id: number;

  @ApiProperty({
    example: 9,
    description: 'The ID of the customer to be assigned to the coach.',
  })
  @IsInt()
  customer_id: number;
}
