import {
  Controller, Get, Post, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TopicsQueryDto, CreateTopicDto, CreateCommentDto, VoteDto } from './dto';

@ApiTags('forum')
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Get('topics')
  findAllTopics(@Query() query: TopicsQueryDto) {
    return this.forumService.findAllTopics(query);
  }

  @Get('topics/:slug')
  findTopic(@Param('slug') slug: string) {
    return this.forumService.findTopicBySlug(slug);
  }

  @Post('topics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createTopic(@CurrentUser('id') userId: string, @Body() dto: CreateTopicDto) {
    return this.forumService.createTopic(userId, dto);
  }

  @Post('topics/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  addComment(
    @CurrentUser('id') userId: string,
    @Param('id') topicId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.forumService.addComment(userId, topicId, dto);
  }

  @Post('topics/:id/vote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  vote(
    @CurrentUser('id') userId: string,
    @Param('id') topicId: string,
    @Body() dto: VoteDto,
  ) {
    return this.forumService.vote(userId, topicId, dto.value);
  }
}
