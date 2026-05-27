import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt } from 'class-validator';

// export enum AttendanceAction {
//   CHECKIN = 'checkin',
//   CHECKOUT = 'checkout',
// }

export class AttendanceDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the user checking in or out.',
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    example: 'checkin',
    description: "The action to perform, either 'checkin' or 'checkout'.",
  })
  @IsEnum(['checkin', 'checkout'])
  action: 'checkin' | 'checkout';
}
