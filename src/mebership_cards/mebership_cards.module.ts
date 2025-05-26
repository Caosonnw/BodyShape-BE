import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { MebershipCardsController } from './mebership_cards.controller';
import { MebershipCardsService } from './mebership_cards.service';

@Module({
  controllers: [MebershipCardsController],
  providers: [MebershipCardsService, PrismaClient, JwtService],
})
export class MebershipCardsModule {}
