import { ApiProperty } from '@nestjs/swagger';

export class UploadVideoDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  video: any;
}
