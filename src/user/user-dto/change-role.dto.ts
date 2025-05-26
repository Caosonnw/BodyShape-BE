import { Role, RoleType } from '@/utils/type';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class ChangeRoleDto {
  @ApiProperty({
    description: 'Role to be changed',
    enum: Role,
    example: Role.ADMIN,
  })
  @IsEnum(Role)
  role: RoleType;
}
