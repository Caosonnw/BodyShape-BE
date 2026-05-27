import { VideosController } from '@/videos/videos.controller';
import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';

@Module({
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
