import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  full_name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 50)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  gender?: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  date_of_birth?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 20)
  phone_number?: string;

  @IsString()
  refresh_token?: string;
}
