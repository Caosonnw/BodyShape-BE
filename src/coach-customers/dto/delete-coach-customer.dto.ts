import { ApiProperty } from '@nestjs/swagger';

export class DeleteCoachCustomerDto {
  @ApiProperty({
    description: 'ID of the coach',
    example: 1,
  })
  coach_id: number;

  @ApiProperty({
    description: 'ID of the customer',
    example: 1,
  })
  customer_id: number;
}
