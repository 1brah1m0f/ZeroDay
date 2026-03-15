import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        phoneNumber: true,
        skills: true,
        interests: true,
        activityPoints: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('İstifadəçi tapılmadı');
    return {
      ...user,
      skills: JSON.parse(user.skills || '[]'),
      interests: JSON.parse(user.interests || '[]'),
    };
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        skills: true,
        interests: true,
        activityPoints: true,
        createdAt: true,
        userBadges: { include: { badge: true } },
        experiences: { orderBy: { startDate: 'desc' } },
        listings: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            images: true,
            tags: true,
            createdAt: true,
            _count: { select: { applications: true } },
          },
        },
        communities: {
          include: {
            community: {
              select: { id: true, name: true, slug: true, avatarUrl: true },
            },
          },
        },
        eventParticipations: {
          include: {
            event: {
              select: {
                id: true, title: true, startDate: true,
                community: { select: { name: true, slug: true } },
              },
            },
          },
          orderBy: { joinedAt: 'desc' },
          take: 20,
        },
        _count: { select: { listings: true, communities: true } },
      },
    });
    if (!user) throw new NotFoundException('İstifadəçi tapılmadı');
    return {
      ...user,
      skills: JSON.parse(user.skills || '[]'),
      interests: JSON.parse(user.interests || '[]'),
    };
  }

  async updateProfile(userId: string, dto: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    phoneNumber?: string;
    skills?: string[];
    interests?: string[];
  }) {
    const data: any = {};
    if (dto.displayName !== undefined) data.displayName = dto.displayName;
    if (dto.bio !== undefined) data.bio = dto.bio;
    if (dto.avatarUrl !== undefined) data.avatarUrl = dto.avatarUrl;
    if (dto.phoneNumber !== undefined) data.phoneNumber = dto.phoneNumber;
    if (dto.skills) data.skills = JSON.stringify(dto.skills);
    if (dto.interests) data.interests = JSON.stringify(dto.interests);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        phoneNumber: true,
        skills: true,
        interests: true,
        activityPoints: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });
    return {
      ...user,
      skills: JSON.parse(user.skills || '[]'),
      interests: JSON.parse(user.interests || '[]'),
    };
  }

  async searchUsers(filters: {
    q?: string;
    skills?: string[];
    minPoints?: number;
    limit?: number;
  }) {
    const where: any = {};
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
      take: filters.limit || 50,
      orderBy: { activityPoints: 'desc' },
    });

    // Filter by skills (in-memory for SQLite)
    if (filters.skills && filters.skills.length > 0) {
      users = users.filter((u) => {
        const userSkills: string[] = JSON.parse(u.skills || '[]');
        return filters.skills!.some((s) =>
          userSkills.some((us) => us.toLowerCase().includes(s.toLowerCase()))
        );
      });
    }

    return users.map((u) => ({
      ...u,
      skills: JSON.parse(u.skills || '[]'),
      interests: JSON.parse(u.interests || '[]'),
    }));
  }
}
