import {
  Controller, Get, Post, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('q') q?: string) {
    return this.groupsService.findAll({ page, limit, q });
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.groupsService.findBySlug(slug);
  }

  @Get(':slug/members')
  getMembers(@Param('slug') slug: string) {
    return this.groupsService.getMembers(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@CurrentUser('id') userId: string, @Body() dto: any) {
    return this.groupsService.create(userId, dto);
  }

  @Post(':slug/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  join(@Param('slug') slug: string, @CurrentUser('id') userId: string) {
    return this.groupsService.join(slug, userId);
  }

  @Delete(':slug/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  leave(@Param('slug') slug: string, @CurrentUser('id') userId: string) {
    return this.groupsService.leave(slug, userId);
  }
}
