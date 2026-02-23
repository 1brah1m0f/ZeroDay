import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class ForumService {
  constructor(private prisma: PrismaService) { }

  async findAllTopics(params: { page?: number | string; limit?: number | string; q?: string; tag?: string }) {
    const page = Math.max(1, parseInt(String(params.page || '1'), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(params.limit || '20'), 10)));
    const { q, tag } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { body: { contains: q } },
      ];
    }
    if (tag) where.tags = { contains: tag };

    const [data, total] = await Promise.all([
      this.prisma.forumTopic.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        include: {
          author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          _count: { select: { comments: true } },
          votes: { select: { value: true } },
        },
      }),
      this.prisma.forumTopic.count({ where }),
    ]);

    return {
      data: data.map((t) => {
        const upvotes = t.votes.reduce((acc, vote) => acc + vote.value, 0);
        const { votes, ...rest } = t;
        return {
          ...rest,
          commentCount: t._count.comments,
          upvotes,
        };
      }),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findTopicBySlug(slug: string) {
    const topic = await this.prisma.forumTopic.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        comments: {
          where: { parentId: null },
          include: {
            author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
            replies: {
              include: {
                author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { comments: true } },
        votes: { select: { value: true } },
      },
    });
    if (!topic) throw new NotFoundException('Mövzu tapılmadı');

    const upvotes = topic.votes.reduce((acc, vote) => acc + vote.value, 0);
    const { votes, ...rest } = topic;
    return {
      ...rest,
      upvotes,
    };
  }

  async createTopic(userId: string, dto: { title: string; body: string; tags?: string[] }) {
    const slug = slugify(dto.title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
    return this.prisma.forumTopic.create({
      data: {
        title: dto.title,
        slug,
        body: dto.body,
        tags: JSON.stringify(dto.tags || []),
        authorId: userId,
      },
    });
  }

  async addComment(userId: string, topicId: string, dto: { body: string; parentId?: string }) {
    const topic = await this.prisma.forumTopic.findUnique({ where: { id: topicId } });
    if (!topic) throw new NotFoundException('Mövzu tapılmadı');
    if (topic.isLocked) throw new ForbiddenException('Bu mövzu bağlanıb');

    return this.prisma.forumComment.create({
      data: {
        body: dto.body,
        topicId,
        parentId: dto.parentId,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });
  }

  async vote(userId: string, topicId: string, value: 1 | -1) {
    const existing = await this.prisma.forumVote.findUnique({
      where: { userId_topicId: { userId, topicId } },
    });

    if (existing) {
      if (existing.value === value) {
        await this.prisma.forumVote.delete({ where: { id: existing.id } });
        return { message: 'Səs silindi' };
      }
      return this.prisma.forumVote.update({
        where: { id: existing.id },
        data: { value },
      });
    }

    return this.prisma.forumVote.create({
      data: { value, userId, topicId },
    });
  }
}
