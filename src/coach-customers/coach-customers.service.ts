import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CoachCustomersService {
  constructor(private prisma: PrismaClient) {}
}
