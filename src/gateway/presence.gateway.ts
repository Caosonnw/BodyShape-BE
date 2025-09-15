import { PresenceService } from '@/presence/presence.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type Status = 'ONLINE' | 'OFFLINE';
const connectionCountByUser = new Map<number, number>();
const socketUser = new Map<string, number>();
const userRoom = (userId: number) => `user:${userId}`;

@Injectable()
@WebSocketGateway(8081, {
  namespace: '/presence',
  cors: { origin: '*' },
})
export class PresenceGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() io: Server;
  private readonly logger = new Logger(PresenceGateway.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
    private readonly presence: PresenceService,
  ) {}

  afterInit(server: Server) {
    const secret = this.cfg.get<string>('JWT_SECRET');

    // Socket.IO middleware: verify JWT cho mọi kết nối
    server.use((socket, next) => {
      try {
        const raw =
          socket.handshake.auth?.token ||
          socket.handshake.headers?.authorization
            ?.toString()
            .replace('Bearer ', '');
        if (!raw) return next(new Error('Missing token'));

        const payload = this.jwt.verify(raw, { secret });

        const uid = Number(payload.sub ?? payload.user_id);
        if (!uid || Number.isNaN(uid))
          return next(new Error('Invalid token payload'));

        // Lưu user vào socket.data
        socket.data.userId = uid;
        socket.data.role = payload.role;
        next();
      } catch (e: any) {
        return next(new Error(e?.message || 'Unauthorized'));
      }
    });

    this.logger.log('[PresenceGateway] ready on :8081 /presence');
  }

  async handleConnection(client: Socket) {
    // userId đã được gắn từ middleware
    const userId: number | undefined = client.data.userId;
    if (!userId) {
      client.emit('presence:error', { message: 'unauthorized' });
      client.disconnect();
      return;
    }

    socketUser.set(client.id, userId);

    const cur = connectionCountByUser.get(userId) ?? 0;
    connectionCountByUser.set(userId, cur + 1);

    client.join(userRoom(userId));

    if (cur === 0) {
      await this.presence.setOnline(userId);
      this.broadcastUpdate(userId, 'ONLINE');
    }

    client.emit('presence:connected', { ok: true });
  }

  async handleDisconnect(client: Socket) {
    const userId = socketUser.get(client.id);
    socketUser.delete(client.id);
    if (userId == null) return;

    const cur = connectionCountByUser.get(userId) ?? 0;
    const next = Math.max(0, cur - 1);
    if (next === 0) {
      connectionCountByUser.delete(userId);
      await this.presence.setOffline(userId);
      this.broadcastUpdate(userId, 'OFFLINE');
    } else {
      connectionCountByUser.set(userId, next);
    }
  }

  @SubscribeMessage('presence:watch')
  async onWatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userIds: number[] },
  ) {
    const ids = Array.from(new Set(payload?.userIds || [])).filter(
      Number.isFinite,
    ) as number[];
    ids.forEach((id) => client.join(userRoom(id)));
    const statuses = await this.presence.getStatuses(ids);
    client.emit('presence:now', statuses);
  }

  private broadcastUpdate(userId: number, status: Status) {
    this.io.to(userRoom(userId)).emit('presence:update', { userId, status });
  }
}
