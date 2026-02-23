import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) { }

  async getConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((c) => ({
      id: c.id,
      participants: c.participants.map((p) => p.user),
      lastMessage: c.messages[0] || null,
      updatedAt: c.updatedAt,
    }));
  }

  async getMessages(conversationId: string, userId: string, params: { page?: number; limit?: number }) {
    const { page = 1, limit = 50 } = params;

    // Verify participant
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { userId_conversationId: { userId, conversationId } },
    });
    if (!participant) throw new ForbiddenException('Bu söhbətə çıxışınız yoxdur');

    const messages = await this.prisma.chatMessage.findMany({
      where: { conversationId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });

    // Mark as read
    await this.prisma.chatMessage.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return messages.reverse();
  }

  async sendMessage(userId: string, recipientId: string, body: string) {
    // Find existing conversation between users or create one
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: recipientId } } },
        ],
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          participants: {
            createMany: {
              data: [{ userId }, { userId: recipientId }],
            },
          },
        },
      });
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        body,
        senderId: userId,
        conversationId: conversation.id,
      },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return { conversationId: conversation.id, message };
  }

  async sendMessageToConversation(userId: string, conversationId: string, body: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { userId_conversationId: { userId, conversationId } },
    });
    if (!participant) throw new ForbiddenException('Bu söhbətə çıxışınız yoxdur');

    const message = await this.prisma.chatMessage.create({
      data: {
        body,
        senderId: userId,
        conversationId,
      },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return { conversationId, message };
  }
}
