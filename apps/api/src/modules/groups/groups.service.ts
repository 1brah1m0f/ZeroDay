import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) { }

  // ─── Community CRUD ──────────────────────────────────────────────────────

  async findAll(params: { page?: number | string; limit?: number | string; q?: string; type?: string }) {
    const page = Math.max(1, parseInt(String(params.page || '1'), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(params.limit || '20'), 10)));
    const { q, type } = params;
    const skip = (page - 1) * limit;

    const where: any = { privacy: 'PUBLIC' };
    if (type) where.type = type;
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.community.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          _count: { select: { members: true, events: true, channels: true } },
        },
      }),
      this.prisma.community.count({ where }),
    ]);

    return {
      data: data.map((c) => ({
        ...c,
        memberCount: c._count.members,
        eventCount: c._count.events,
        channelCount: c._count.channels,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string, userId?: string) {
    const community = await this.prisma.community.findUnique({
      where: { slug },
      include: {
        owner: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        _count: { select: { members: true, events: true, channels: true } },
        channels: { orderBy: { createdAt: 'asc' } },
        announcements: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { id: true, displayName: true, avatarUrl: true } } },
        },
      },
    });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    let isMember = false;
    let memberRole: string | null = null;
    if (userId) {
      const membership = await this.prisma.communityMember.findUnique({
        where: { userId_communityId: { userId, communityId: community.id } },
      });
      if (membership) {
        isMember = true;
        memberRole = membership.role;
      }
    }

    return {
      ...community,
      memberCount: community._count.members,
      eventCount: community._count.events,
      channelCount: community._count.channels,
      isMember,
      memberRole,
    };
  }

  async create(userId: string, dto: {
    name: string;
    description: string;
    type?: string;
    privacy?: string;
    tags?: string[];
  }) {
    const slug = slugify(dto.name, { lower: true, strict: true });
    const exists = await this.prisma.community.findUnique({ where: { slug } });
    if (exists) throw new ConflictException('Bu adla icma artıq mövcuddur');

    const community = await this.prisma.community.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        type: dto.type || 'TECH',
        privacy: dto.privacy || 'PUBLIC',
        tags: JSON.stringify(dto.tags || []),
        ownerId: userId,
        members: {
          create: { userId, role: 'OWNER' },
        },
        // Create default channels
        channels: {
          createMany: {
            data: [
              { name: 'Ümumi', slug: 'umumi', type: 'TEXT', isDefault: true, category: 'Ümumi' },
              { name: 'Elanlar', slug: 'elanlar', type: 'ANNOUNCEMENT', category: 'Ümumi' },
              { name: 'Suallar', slug: 'suallar', type: 'TEXT', category: 'Müzakirə' },
              { name: 'Resurslar', slug: 'resurslar', type: 'TEXT', category: 'Müzakirə' },
            ],
          },
        },
      },
      include: {
        owner: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        channels: true,
      },
    });

    return community;
  }

  async update(slug: string, userId: string, dto: {
    name?: string;
    description?: string;
    type?: string;
    privacy?: string;
    tags?: string[];
    coverUrl?: string;
    avatarUrl?: string;
  }) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    await this.requireRole(community.id, userId, ['OWNER', 'ADMIN']);

    const data: any = { ...dto };
    if (dto.tags) data.tags = JSON.stringify(dto.tags);
    delete data.slug; // Don't allow slug changes

    return this.prisma.community.update({
      where: { id: community.id },
      data,
      include: {
        owner: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        _count: { select: { members: true } },
      },
    });
  }

  // ─── Membership ──────────────────────────────────────────────────────────

  async join(slug: string, userId: string) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');
    if (community.privacy === 'INVITE_ONLY') throw new ForbiddenException('Bu icma yalnız dəvətlə qoşulmağa icazə verir');

    const existing = await this.prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId: community.id } },
    });
    if (existing) throw new ConflictException('Artıq üzvsiniz');

    // Award activity points for joining a community
    await this.prisma.user.update({
      where: { id: userId },
      data: { activityPoints: { increment: 5 } },
    });

    return this.prisma.communityMember.create({
      data: { userId, communityId: community.id },
    });
  }

  async leave(slug: string, userId: string) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');
    if (community.ownerId === userId) throw new ForbiddenException('Sahibi icmadan çıxa bilməz');

    await this.prisma.communityMember.delete({
      where: { userId_communityId: { userId, communityId: community.id } },
    });
    return { message: 'İcmadan çıxdınız' };
  }

  async getMembers(slug: string, params: { page?: number; limit?: number; role?: string }) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 50));
    const where: any = { communityId: community.id };
    if (params.role) where.role = params.role;

    const [data, total] = await Promise.all([
      this.prisma.communityMember.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true, username: true, displayName: true, avatarUrl: true,
              skills: true, activityPoints: true,
            },
          },
        },
        orderBy: { joinedAt: 'asc' },
      }),
      this.prisma.communityMember.count({ where }),
    ]);

    return { data, meta: { total, page, limit } };
  }

  async updateMemberRole(slug: string, userId: string, targetUserId: string, newRole: string) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    await this.requireRole(community.id, userId, ['OWNER', 'ADMIN']);

    if (targetUserId === community.ownerId) throw new ForbiddenException('Sahibin rolunu dəyişə bilməzsiniz');

    return this.prisma.communityMember.update({
      where: { userId_communityId: { userId: targetUserId, communityId: community.id } },
      data: { role: newRole },
    });
  }

  async removeMember(slug: string, userId: string, targetUserId: string) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    await this.requireRole(community.id, userId, ['OWNER', 'ADMIN']);

    if (targetUserId === community.ownerId) throw new ForbiddenException('Sahibi silə bilməzsiniz');

    await this.prisma.communityMember.delete({
      where: { userId_communityId: { userId: targetUserId, communityId: community.id } },
    });
    return { message: 'Üzv silindi' };
  }

  // ─── Announcements ───────────────────────────────────────────────────────

  async getAnnouncements(slug: string, params: { page?: number; limit?: number }) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 20));

    const [data, total] = await Promise.all([
      this.prisma.announcement.findMany({
        where: { communityId: community.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        include: { author: { select: { id: true, displayName: true, avatarUrl: true } } },
      }),
      this.prisma.announcement.count({ where: { communityId: community.id } }),
    ]);

    return { data, meta: { total, page, limit } };
  }

  async createAnnouncement(slug: string, userId: string, dto: { title: string; body: string; isPinned?: boolean }) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    await this.requireRole(community.id, userId, ['OWNER', 'ADMIN', 'MODERATOR']);

    return this.prisma.announcement.create({
      data: {
        title: dto.title,
        body: dto.body,
        isPinned: dto.isPinned || false,
        communityId: community.id,
        authorId: userId,
      },
      include: { author: { select: { id: true, displayName: true, avatarUrl: true } } },
    });
  }

  async deleteAnnouncement(slug: string, userId: string, announcementId: string) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    await this.requireRole(community.id, userId, ['OWNER', 'ADMIN']);

    await this.prisma.announcement.delete({ where: { id: announcementId } });
    return { message: 'Elan silindi' };
  }

  // ─── Events ──────────────────────────────────────────────────────────────

  async getEvents(slug: string) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    return this.prisma.event.findMany({
      where: { communityId: community.id },
      orderBy: { startDate: 'asc' },
      include: { _count: { select: { participants: true } } },
    });
  }

  async createEvent(slug: string, userId: string, dto: {
    title: string; description: string; location?: string;
    startDate: string; endDate?: string; maxAttendees?: number;
  }) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    await this.requireRole(community.id, userId, ['OWNER', 'ADMIN', 'MODERATOR']);

    // Create event and auto-create an event channel
    const eventSlug = slugify(dto.title, { lower: true, strict: true });
    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        location: dto.location,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        maxAttendees: dto.maxAttendees,
        communityId: community.id,
      },
    });

    // Auto-create event channel
    await this.prisma.channel.create({
      data: {
        name: `📅 ${dto.title}`,
        slug: `event-${eventSlug}-${event.id.slice(0, 6)}`,
        type: 'EVENT',
        category: 'Tədbirlər',
        communityId: community.id,
      },
    });

    return event;
  }

  async joinEvent(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Tədbir tapılmadı');

    if (event.maxAttendees) {
      const count = await this.prisma.eventParticipation.count({ where: { eventId } });
      if (count >= event.maxAttendees) throw new ForbiddenException('Tədbir doludur');
    }

    // Award activity points for event participation
    await this.prisma.user.update({
      where: { id: userId },
      data: { activityPoints: { increment: 10 } },
    });

    return this.prisma.eventParticipation.create({
      data: { userId, eventId },
    });
  }

  // ─── Invitations ─────────────────────────────────────────────────────────

  async searchUsersForInvite(slug: string, userId: string, filters: {
    skills?: string[]; minPoints?: number; q?: string;
  }) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    await this.requireRole(community.id, userId, ['OWNER', 'ADMIN']);

    // Get existing member IDs to exclude
    const existingMembers = await this.prisma.communityMember.findMany({
      where: { communityId: community.id },
      select: { userId: true },
    });
    const memberIds = existingMembers.map((m) => m.userId);

    const where: any = {
      id: { notIn: memberIds },
    };

    if (filters.q) {
      where.OR = [
        { displayName: { contains: filters.q } },
        { username: { contains: filters.q } },
      ];
    }

    if (filters.minPoints) {
      where.activityPoints = { gte: filters.minPoints };
    }

    let users = await this.prisma.user.findMany({
      where,
      select: {
        id: true, username: true, displayName: true, avatarUrl: true,
        skills: true, interests: true, activityPoints: true,
      },
      take: 50,
      orderBy: { activityPoints: 'desc' },
    });

    // Filter by skills (in-memory since SQLite doesn't support JSON queries well)
    if (filters.skills && filters.skills.length > 0) {
      users = users.filter((u) => {
        const userSkills: string[] = JSON.parse(u.skills || '[]');
        return filters.skills!.some((s) => userSkills.some((us) => us.toLowerCase().includes(s.toLowerCase())));
      });
    }

    return users;
  }

  async sendInvitation(slug: string, senderId: string, dto: {
    receiverId: string; message?: string; channel?: string;
  }) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    await this.requireRole(community.id, senderId, ['OWNER', 'ADMIN']);

    return this.prisma.invitation.create({
      data: {
        communityId: community.id,
        senderId,
        receiverId: dto.receiverId,
        message: dto.message,
        channel: dto.channel || 'PLATFORM',
      },
      include: {
        community: { select: { name: true, slug: true, avatarUrl: true } },
        sender: { select: { id: true, displayName: true } },
      },
    });
  }

  async sendBulkInvitations(slug: string, senderId: string, dto: {
    receiverIds: string[]; message?: string;
  }) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    await this.requireRole(community.id, senderId, ['OWNER', 'ADMIN']);

    const results: any[] = [];
    for (const receiverId of dto.receiverIds) {
      try {
        const inv = await this.prisma.invitation.create({
          data: {
            communityId: community.id,
            senderId,
            receiverId,
            message: dto.message,
          },
        });
        results.push({ receiverId, status: 'sent', id: inv.id });
      } catch {
        results.push({ receiverId, status: 'failed' });
      }
    }
    return { sent: results.filter((r) => r.status === 'sent').length, results };
  }

  async getMyInvitations(userId: string) {
    return this.prisma.invitation.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: {
        community: { select: { id: true, name: true, slug: true, avatarUrl: true, description: true } },
        sender: { select: { id: true, displayName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async respondToInvitation(invitationId: string, userId: string, accept: boolean) {
    const invitation = await this.prisma.invitation.findUnique({ where: { id: invitationId } });
    if (!invitation) throw new NotFoundException('Dəvət tapılmadı');
    if (invitation.receiverId !== userId) throw new ForbiddenException('Bu dəvət sizə aid deyil');

    if (accept) {
      // Add to community
      await this.prisma.communityMember.create({
        data: { userId, communityId: invitation.communityId },
      });
      // Award points
      await this.prisma.user.update({
        where: { id: userId },
        data: { activityPoints: { increment: 5 } },
      });
    }

    return this.prisma.invitation.update({
      where: { id: invitationId },
      data: { status: accept ? 'ACCEPTED' : 'REJECTED' },
    });
  }

  // ─── Channels ─────────────────────────────────────────────────────────────

  async getChannels(slug: string) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    const channels = await this.prisma.channel.findMany({
      where: { communityId: community.id },
      orderBy: [{ category: 'asc' }, { createdAt: 'asc' }],
      include: { _count: { select: { messages: true } } },
    });

    // Group by category
    const grouped: Record<string, any[]> = {};
    for (const ch of channels) {
      const cat = ch.category || 'Digər';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(ch);
    }

    return { channels, grouped };
  }

  async createChannel(slug: string, userId: string, dto: {
    name: string; description?: string; type?: string; category?: string;
  }) {
    const community = await this.prisma.community.findUnique({ where: { slug } });
    if (!community) throw new NotFoundException('İcma tapılmadı');

    await this.requireRole(community.id, userId, ['OWNER', 'ADMIN']);

    const channelSlug = slugify(dto.name, { lower: true, strict: true });

    return this.prisma.channel.create({
      data: {
        name: dto.name,
        slug: channelSlug,
        description: dto.description,
        type: dto.type || 'TEXT',
        category: dto.category || 'Digər',
        communityId: community.id,
      },
    });
  }

  async getChannelMessages(channelId: string, userId: string, params: { page?: number; limit?: number }) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: { community: { select: { id: true } } },
    });
    if (!channel) throw new NotFoundException('Kanal tapılmadı');

    // Verify user is a member of the community
    const member = await this.prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId: channel.community.id } },
    });
    if (!member) throw new ForbiddenException('Bu kanala giriş icazəniz yoxdur');

    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 50));

    const messages = await this.prisma.channelMessage.findMany({
      where: { channelId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });

    return messages.reverse();
  }

  async sendChannelMessage(channelId: string, userId: string, body: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: { community: { select: { id: true } } },
    });
    if (!channel) throw new NotFoundException('Kanal tapılmadı');

    const member = await this.prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId: channel.community.id } },
    });
    if (!member) throw new ForbiddenException('Bu kanala mesaj göndərmə icazəniz yoxdur');

    // Award activity point for messaging
    await this.prisma.user.update({
      where: { id: userId },
      data: { activityPoints: { increment: 1 } },
    });

    return this.prisma.channelMessage.create({
      data: { body, senderId: userId, channelId },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });
  }

  // ─── Helper ──────────────────────────────────────────────────────────────

  private async requireRole(communityId: string, userId: string, roles: string[]) {
    const member = await this.prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId } },
    });
    if (!member || !roles.includes(member.role)) {
      throw new ForbiddenException('Bu əməliyyat üçün icazəniz yoxdur');
    }
  }
}
