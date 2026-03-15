import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ChatMessagesQueryDto, SendMessageDto, SendConversationMessageDto } from './dto';

@ApiTags('chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(JwtAuthGuard)
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
    @Query() query: ChatMessagesQueryDto,
  ) {
    return this.chatService.getMessages(conversationId, userId, query);
  }

  @Post('messages')
  sendMessage(
    @CurrentUser('id') userId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(userId, dto.recipientId, dto.body);
  }

  @Post('conversations/:id/messages')
  sendMessageToConversation(
    @Param('id') conversationId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SendConversationMessageDto,
  ) {
    return this.chatService.sendMessageToConversation(userId, conversationId, dto.body);
  }
}
