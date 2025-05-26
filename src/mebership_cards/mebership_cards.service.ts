import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MebershipCardsService {
  constructor(private prisma: PrismaClient) {}
}
