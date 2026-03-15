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
import { WS_EVENTS } from '@comtech/shared';

// Extended WS events for community channels
const CHANNEL_EVENTS = {
  JOIN_CHANNEL: 'channel:join',
  LEAVE_CHANNEL: 'channel:leave',
  SEND_CHANNEL_MSG: 'channel:message:send',
  NEW_CHANNEL_MSG: 'channel:message:new',
  CHANNEL_TYPING_START: 'channel:typing:start',
  CHANNEL_TYPING_STOP: 'channel:typing:stop',
};

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

  // ─── Direct Messages ──────────────────────────────────────────────────────

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

  // ─── Channel (Discord-style) Messages ─────────────────────────────────────

  @SubscribeMessage(CHANNEL_EVENTS.JOIN_CHANNEL)
  handleJoinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    client.join(`channel:${data.channelId}`);
    return { joined: data.channelId };
  }

  @SubscribeMessage(CHANNEL_EVENTS.LEAVE_CHANNEL)
  handleLeaveChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    client.leave(`channel:${data.channelId}`);
    return { left: data.channelId };
  }

  @SubscribeMessage(CHANNEL_EVENTS.SEND_CHANNEL_MSG)
  async handleChannelMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string; body: string },
  ) {
    const userId = client.handshake.query.userId as string;

    // Use REST endpoint logic via the communities service (imported through chat service)
    // For now, broadcast to channel room
    const message = {
      id: Date.now().toString(),
      body: data.body,
      senderId: userId,
      channelId: data.channelId,
      createdAt: new Date().toISOString(),
    };

    // Broadcast to all users in the channel room
    this.server.to(`channel:${data.channelId}`).emit(CHANNEL_EVENTS.NEW_CHANNEL_MSG, message);

    return message;
  }

  @SubscribeMessage(CHANNEL_EVENTS.CHANNEL_TYPING_START)
  handleChannelTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    const userId = client.handshake.query.userId as string;
    client.to(`channel:${data.channelId}`).emit(CHANNEL_EVENTS.CHANNEL_TYPING_START, {
      userId,
      channelId: data.channelId,
    });
  }

  @SubscribeMessage(CHANNEL_EVENTS.CHANNEL_TYPING_STOP)
  handleChannelTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    const userId = client.handshake.query.userId as string;
    client.to(`channel:${data.channelId}`).emit(CHANNEL_EVENTS.CHANNEL_TYPING_STOP, {
      userId,
      channelId: data.channelId,
    });
  }
}
