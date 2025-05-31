import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaClient) {}
}
