import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // cho phép CORS nếu iOS client khác host
export class HealthGateway {
  @WebSocketServer()
  server: Server;

  // Lưu map userId -> socketId nếu cần (ở đây đơn giản)

  // Nhận dữ liệu từ client
  @SubscribeMessage('sendHealthData')
  handleSendHealthData(
    @MessageBody() data: { userId: number; healthData: any },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(
      'Received health data from user:',
      data.userId,
      data.healthData,
    );

    // Ví dụ: Phát data cho các client khác cùng userId hoặc xử lý khác
    this.server.emit(`healthDataUpdate:${data.userId}`, data.healthData);

    // Có thể trả kết quả
    return { status: 'ok' };
  }

  // Khi client kết nối
  handleConnection(client: Socket) {
    console.log('🔌 Client connected from HealthKit:', client.id);
  }

  // Khi client disconnect
  handleDisconnect(client: Socket) {
    console.log('❌ Client disconnected from HealthKit:', client.id);
  }
}
