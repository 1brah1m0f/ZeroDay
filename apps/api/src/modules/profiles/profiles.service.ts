import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: string, dto: { displayName?: string; bio?: string; avatarUrl?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true, username: true, displayName: true, email: true,
        avatarUrl: true, bio: true, role: true, isVerified: true,
      },
    });
  }

  // ─── Experiences ─────────────────────────────────────────
  async getExperiences(userId: string) {
    return this.prisma.experience.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  async addExperience(userId: string, dto: {
    title: string; organization: string; description?: string;
    startDate: string; endDate?: string; isCurrent?: boolean;
  }) {
    return this.prisma.experience.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        isCurrent: dto.isCurrent || false,
        userId,
      },
    });
  }

  async updateExperience(id: string, userId: string, dto: any) {
    const exp = await this.prisma.experience.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException('Təcrübə tapılmadı');
    if (exp.userId !== userId) throw new ForbiddenException();

    return this.prisma.experience.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async deleteExperience(id: string, userId: string) {
    const exp = await this.prisma.experience.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException('Təcrübə tapılmadı');
    if (exp.userId !== userId) throw new ForbiddenException();

    await this.prisma.experience.delete({ where: { id } });
    return { message: 'Təcrübə silindi' };
  }
}
