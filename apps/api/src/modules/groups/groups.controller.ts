import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CommunitiesService } from './groups.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('communities')
@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  // ─── Community CRUD ──────────────────────────────────────────────────────

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('q') q?: string,
    @Query('type') type?: string,
  ) {
    return this.communitiesService.findAll({ page, limit, q, type });
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string, @Query('userId') userId?: string) {
    return this.communitiesService.findBySlug(slug, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@CurrentUser('id') userId: string, @Body() dto: any) {
    return this.communitiesService.create(userId, dto);
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('slug') slug: string, @CurrentUser('id') userId: string, @Body() dto: any) {
    return this.communitiesService.update(slug, userId, dto);
  }

  // ─── Membership ──────────────────────────────────────────────────────────

  @Get(':slug/members')
  getMembers(
    @Param('slug') slug: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('role') role?: string,
  ) {
    return this.communitiesService.getMembers(slug, { page, limit, role });
  }

  @Post(':slug/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  join(@Param('slug') slug: string, @CurrentUser('id') userId: string) {
    return this.communitiesService.join(slug, userId);
  }

  @Delete(':slug/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  leave(@Param('slug') slug: string, @CurrentUser('id') userId: string) {
    return this.communitiesService.leave(slug, userId);
  }

  @Put(':slug/members/:targetUserId/role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateMemberRole(
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
    @Param('targetUserId') targetUserId: string,
    @Body('role') newRole: string,
  ) {
    return this.communitiesService.updateMemberRole(slug, userId, targetUserId, newRole);
  }

  @Delete(':slug/members/:targetUserId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  removeMember(
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
    @Param('targetUserId') targetUserId: string,
  ) {
    return this.communitiesService.removeMember(slug, userId, targetUserId);
  }

  // ─── Announcements ───────────────────────────────────────────────────────

  @Get(':slug/announcements')
  getAnnouncements(
    @Param('slug') slug: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.communitiesService.getAnnouncements(slug, { page, limit });
  }

  @Post(':slug/announcements')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createAnnouncement(@Param('slug') slug: string, @CurrentUser('id') userId: string, @Body() dto: any) {
    return this.communitiesService.createAnnouncement(slug, userId, dto);
  }

  @Delete(':slug/announcements/:announcementId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteAnnouncement(
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
    @Param('announcementId') announcementId: string,
  ) {
    return this.communitiesService.deleteAnnouncement(slug, userId, announcementId);
  }

  // ─── Events ──────────────────────────────────────────────────────────────

  @Get(':slug/events')
  getEvents(@Param('slug') slug: string) {
    return this.communitiesService.getEvents(slug);
  }

  @Post(':slug/events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createEvent(@Param('slug') slug: string, @CurrentUser('id') userId: string, @Body() dto: any) {
    return this.communitiesService.createEvent(slug, userId, dto);
  }

  @Post('events/:eventId/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  joinEvent(@Param('eventId') eventId: string, @CurrentUser('id') userId: string) {
    return this.communitiesService.joinEvent(eventId, userId);
  }

  // ─── Invitations ─────────────────────────────────────────────────────────

  @Post(':slug/invite/search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  searchUsersForInvite(
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
    @Body() filters: any,
  ) {
    return this.communitiesService.searchUsersForInvite(slug, userId, filters);
  }

  @Post(':slug/invite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  sendInvitation(@Param('slug') slug: string, @CurrentUser('id') userId: string, @Body() dto: any) {
    return this.communitiesService.sendInvitation(slug, userId, dto);
  }

  @Post(':slug/invite/bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  sendBulkInvitations(@Param('slug') slug: string, @CurrentUser('id') userId: string, @Body() dto: any) {
    return this.communitiesService.sendBulkInvitations(slug, userId, dto);
  }

  @Get('invitations/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMyInvitations(@CurrentUser('id') userId: string) {
    return this.communitiesService.getMyInvitations(userId);
  }

  @Post('invitations/:invitationId/respond')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  respondToInvitation(
    @Param('invitationId') invitationId: string,
    @CurrentUser('id') userId: string,
    @Body('accept') accept: boolean,
  ) {
    return this.communitiesService.respondToInvitation(invitationId, userId, accept);
  }

  // ─── Channels ─────────────────────────────────────────────────────────────

  @Get(':slug/channels')
  getChannels(@Param('slug') slug: string) {
    return this.communitiesService.getChannels(slug);
  }

  @Post(':slug/channels')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createChannel(@Param('slug') slug: string, @CurrentUser('id') userId: string, @Body() dto: any) {
    return this.communitiesService.createChannel(slug, userId, dto);
  }

  @Get('channels/:channelId/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getChannelMessages(
    @Param('channelId') channelId: string,
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.communitiesService.getChannelMessages(channelId, userId, { page, limit });
  }

  @Post('channels/:channelId/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  sendChannelMessage(
    @Param('channelId') channelId: string,
    @CurrentUser('id') userId: string,
    @Body('body') body: string,
  ) {
    return this.communitiesService.sendChannelMessage(channelId, userId, body);
  }
}
