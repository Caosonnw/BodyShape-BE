import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PresenceService {
  constructor(private prisma: PrismaClient) {}

  async setOnline(userId: number) {
    await this.prisma.users.update({
      where: { user_id: userId },
      data: { status: 'ONLINE' },
    });
  }

  async setOffline(userId: number) {
    await this.prisma.users.update({
      where: { user_id: userId },
      data: { status: 'OFFLINE' },
    });
  }

  async getStatuses(userIds: number[]) {
    const users = await this.prisma.users.findMany({
      where: { user_id: { in: userIds } },
      select: { user_id: true, status: true },
    });
    // Trả về map gọn
    const map: Record<number, 'ONLINE' | 'OFFLINE'> = {};
    for (const u of users) map[u.user_id] = (u.status as any) ?? 'OFFLINE';
    return map;
  }
}
