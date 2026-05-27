import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, PrismaClient, JwtService],
})
export class ReviewsModule {}
