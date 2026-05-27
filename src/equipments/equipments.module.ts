import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { EquipmentsController } from './equipments.controller';
import { EquipmentsService } from './equipments.service';

@Module({
  controllers: [EquipmentsController],
  providers: [EquipmentsService, PrismaClient, JwtService],
})
export class EquipmentsModule {}
