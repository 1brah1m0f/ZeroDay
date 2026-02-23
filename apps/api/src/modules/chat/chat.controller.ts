import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Get('conversations')
  getConversations(@CurrentUser('id') userId: string) {
    return this.chatService.getConversations(userId);
  }

  @Get('conversations/:id/messages')
  getMessages(
    @Param('id') conversationId: string,
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatService.getMessages(conversationId, userId, {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Post('messages')
  sendMessage(
    @CurrentUser('id') userId: string,
    @Body() dto: { recipientId: string; body: string },
  ) {
    return this.chatService.sendMessage(userId, dto.recipientId, dto.body);
  }

  @Post('conversations/:id/messages')
  sendMessageToConversation(
    @Param('id') conversationId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: { body: string },
  ) {
    return this.chatService.sendMessageToConversation(userId, conversationId, dto.body);
  }
}
