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
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('İstifadəçi tapılmadı');
    return user;
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
        groups: { select: { groupId: true } },
        _count: { select: { listings: true, groups: true } },
      },
    });
    if (!user) throw new NotFoundException('İstifadəçi tapılmadı');
    return user;
  }

  async updateProfile(userId: string, dto: { displayName?: string; bio?: string; avatarUrl?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }
}
