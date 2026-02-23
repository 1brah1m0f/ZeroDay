import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ModerationService {
  constructor(private prisma: PrismaService) {}

  async deleteListing(id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Elan tapılmadı');
    await this.prisma.listing.delete({ where: { id } });
    return { message: 'Elan moderasiya ilə silindi' };
  }

  async lockTopic(topicId: string) {
    return this.prisma.forumTopic.update({
      where: { id: topicId },
      data: { isLocked: true },
    });
  }

  async unlockTopic(topicId: string) {
    return this.prisma.forumTopic.update({
      where: { id: topicId },
      data: { isLocked: false },
    });
  }

  async pinTopic(topicId: string) {
    return this.prisma.forumTopic.update({
      where: { id: topicId },
      data: { isPinned: true },
    });
  }

  async unpinTopic(topicId: string) {
    return this.prisma.forumTopic.update({
      where: { id: topicId },
      data: { isPinned: false },
    });
  }

  async deleteComment(commentId: string) {
    await this.prisma.forumComment.delete({ where: { id: commentId } });
    return { message: 'Şərh silindi' };
  }

  async banUser(userId: string) {
    // Soft ban: Just change role/deactivate - implement as needed
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: 'USER' }, // Could add isBanned field
    });
  }
}
