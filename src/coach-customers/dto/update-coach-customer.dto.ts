import { ApiProperty } from '@nestjs/swagger';

export class UpdateCoachCustomerDto {
  @ApiProperty({
    description: 'ID of the previous coach',
    example: 1,
  })
  oldCoachId: number;

  @ApiProperty({
    description: 'ID of the previous customer',
    example: 1,
  })
  oldCustomerId: number;

  @ApiProperty({
    description: 'ID of the new coach',
    example: 1,
  })
  newCoachId: number;

  @ApiProperty({
    description: 'ID of the new customer',
    example: 1,
  })
  newCustomerId: number;
}
