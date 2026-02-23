import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.badge.findMany({
      orderBy: { tier: 'asc' },
    });
  }

  async getUserBadges(userId: string) {
    return this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { awardedAt: 'desc' },
    });
  }

  async awardBadge(userId: string, badgeId: string) {
    return this.prisma.userBadge.create({
      data: { userId, badgeId },
      include: { badge: true },
    });
  }
}
