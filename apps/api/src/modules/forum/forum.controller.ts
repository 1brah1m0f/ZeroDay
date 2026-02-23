import {
  Controller, Get, Post, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('forum')
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Get('topics')
  findAllTopics(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('q') q?: string,
    @Query('tag') tag?: string,
  ) {
    return this.forumService.findAllTopics({ page, limit, q, tag });
  }

  @Get('topics/:slug')
  findTopic(@Param('slug') slug: string) {
    return this.forumService.findTopicBySlug(slug);
  }

  @Post('topics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createTopic(@CurrentUser('id') userId: string, @Body() dto: any) {
    return this.forumService.createTopic(userId, dto);
  }

  @Post('topics/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  addComment(
    @CurrentUser('id') userId: string,
    @Param('id') topicId: string,
    @Body() dto: any,
  ) {
    return this.forumService.addComment(userId, topicId, dto);
  }

  @Post('topics/:id/vote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  vote(
    @CurrentUser('id') userId: string,
    @Param('id') topicId: string,
    @Body('value') value: 1 | -1,
  ) {
    return this.forumService.vote(userId, topicId, value);
  }
}
