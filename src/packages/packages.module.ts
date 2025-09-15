import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PackagesController],
  providers: [PackagesService, PrismaClient, JwtService],
})
export class PackagesModule {}
