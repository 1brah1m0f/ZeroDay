import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { WS_EVENTS } from '@kutlewe/shared';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<string, string>(); // userId -> socketId

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.set(userId, client.id);
      this.server.emit(WS_EVENTS.USER_ONLINE, { userId });
    }
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.onlineUsers.entries()].find(([, sid]) => sid === client.id)?.[0];
    if (userId) {
      this.onlineUsers.delete(userId);
      this.server.emit(WS_EVENTS.USER_OFFLINE, { userId });
    }
  }

  @SubscribeMessage(WS_EVENTS.SEND_MESSAGE)
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { recipientId: string; body: string },
  ) {
    const userId = client.handshake.query.userId as string;
    const result = await this.chatService.sendMessage(userId, data.recipientId, data.body);

    // Send to recipient if online
    const recipientSocketId = this.onlineUsers.get(data.recipientId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit(WS_EVENTS.NEW_MESSAGE, result);
    }

    return result;
  }

  @SubscribeMessage(WS_EVENTS.TYPING_START)
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { recipientId: string; conversationId: string },
  ) {
    const userId = client.handshake.query.userId as string;
    const recipientSocketId = this.onlineUsers.get(data.recipientId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit(WS_EVENTS.TYPING_START, {
        userId,
        conversationId: data.conversationId,
      });
    }
  }

  @SubscribeMessage(WS_EVENTS.TYPING_STOP)
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { recipientId: string; conversationId: string },
  ) {
    const userId = client.handshake.query.userId as string;
    const recipientSocketId = this.onlineUsers.get(data.recipientId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit(WS_EVENTS.TYPING_STOP, {
        userId,
        conversationId: data.conversationId,
      });
    }
  }
}
