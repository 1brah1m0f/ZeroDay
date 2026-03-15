import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CommunitiesService } from './groups.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CommunitiesQueryDto,
  CommunityDetailsQueryDto,
  CreateGroupDto,
  UpdateGroupDto,
  MembersQueryDto,
  UpdateMemberRoleDto,
  AnnouncementsQueryDto,
  CreateAnnouncementDto,
  CreateEventDto,
  SearchInviteDto,
  SendInvitationDto,
  BulkInvitationsDto,
  RespondInvitationDto,
  CreateChannelDto,
  ChannelMessagesQueryDto,
  SendChannelMessageDto,
} from './dto';

@ApiTags('communities')
@ApiBearerAuth()
@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  // ─── Community CRUD ──────────────────────────────────────────────────────

  @Get()
  findAll(@Query() query: CommunitiesQueryDto) {
    return this.communitiesService.findAll(query);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string, @Query() query: CommunityDetailsQueryDto) {
    return this.communitiesService.findBySlug(slug, query.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateGroupDto) {
    return this.communitiesService.create(userId, dto);
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('slug') slug: string, @CurrentUser('id') userId: string, @Body() dto: UpdateGroupDto) {
    return this.communitiesService.update(slug, userId, dto);
  }

  // ─── Membership ──────────────────────────────────────────────────────────

  @Get(':slug/members')
  getMembers(@Param('slug') slug: string, @Query() query: MembersQueryDto) {
    return this.communitiesService.getMembers(slug, query);
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
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.communitiesService.updateMemberRole(slug, userId, targetUserId, dto.role);
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
  getAnnouncements(@Param('slug') slug: string, @Query() query: AnnouncementsQueryDto) {
    return this.communitiesService.getAnnouncements(slug, query);
  }

  @Post(':slug/announcements')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createAnnouncement(@Param('slug') slug: string, @CurrentUser('id') userId: string, @Body() dto: CreateAnnouncementDto) {
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
  createEvent(@Param('slug') slug: string, @CurrentUser('id') userId: string, @Body() dto: CreateEventDto) {
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
    @Body() filters: SearchInviteDto,
  ) {
    return this.communitiesService.searchUsersForInvite(slug, userId, filters);
  }

  @Post(':slug/invite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  sendInvitation(@Param('slug') slug: string, @CurrentUser('id') userId: string, @Body() dto: SendInvitationDto) {
    return this.communitiesService.sendInvitation(slug, userId, dto);
  }

  @Post(':slug/invite/bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  sendBulkInvitations(@Param('slug') slug: string, @CurrentUser('id') userId: string, @Body() dto: BulkInvitationsDto) {
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
    @Body() dto: RespondInvitationDto,
  ) {
    return this.communitiesService.respondToInvitation(invitationId, userId, dto.accept);
  }

  // ─── Channels ─────────────────────────────────────────────────────────────

  @Get(':slug/channels')
  getChannels(@Param('slug') slug: string) {
    return this.communitiesService.getChannels(slug);
  }

  @Post(':slug/channels')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createChannel(@Param('slug') slug: string, @CurrentUser('id') userId: string, @Body() dto: CreateChannelDto) {
    return this.communitiesService.createChannel(slug, userId, dto);
  }

  @Get('channels/:channelId/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getChannelMessages(
    @Param('channelId') channelId: string,
    @CurrentUser('id') userId: string,
    @Query() query: ChannelMessagesQueryDto,
  ) {
    return this.communitiesService.getChannelMessages(channelId, userId, query);
  }

  @Post('channels/:channelId/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  sendChannelMessage(
    @Param('channelId') channelId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SendChannelMessageDto,
  ) {
    return this.communitiesService.sendChannelMessage(channelId, userId, dto.body);
  }
}
