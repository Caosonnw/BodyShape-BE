import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway(8081, {
  namespace: '/checkins',
  cors: { origin: '*' },
})
export class CheckinsGateway {
  @WebSocketServer()
  server: Server;

  emitAttendanceUpdated(data: any) {
    this.server.emit('attendance-updated', data);
  }
}
