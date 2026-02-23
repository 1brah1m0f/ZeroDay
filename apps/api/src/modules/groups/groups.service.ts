import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) { }

  async findAll(params: { page?: number | string; limit?: number | string; q?: string }) {
    const page = Math.max(1, parseInt(String(params.page || '1'), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(params.limit || '20'), 10)));
    const { q } = params;
    const skip = (page - 1) * limit;

    const where: any = { privacy: 'PUBLIC' };
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.group.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          _count: { select: { members: true } },
        },
      }),
      this.prisma.group.count({ where }),
    ]);

    return {
      data: data.map((g) => ({ ...g, memberCount: g._count.members })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const group = await this.prisma.group.findUnique({
      where: { slug },
      include: {
        owner: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        _count: { select: { members: true } },
      },
    });
    if (!group) throw new NotFoundException('Qrup tapılmadı');
    return { ...group, memberCount: group._count.members };
  }

  async create(userId: string, dto: { name: string; description: string; privacy?: string; tags?: string[] }) {
    const slug = slugify(dto.name, { lower: true, strict: true });
    const exists = await this.prisma.group.findUnique({ where: { slug } });
    if (exists) throw new ConflictException('Bu adla qrup artıq mövcuddur');

    return this.prisma.group.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        privacy: (dto.privacy as any) || 'PUBLIC',
        tags: JSON.stringify(dto.tags || []),
        ownerId: userId,
        members: {
          create: { userId, role: 'OWNER' },
        },
      },
    });
  }

  async join(slug: string, userId: string) {
    const group = await this.prisma.group.findUnique({ where: { slug } });
    if (!group) throw new NotFoundException('Qrup tapılmadı');

    const existing = await this.prisma.groupMember.findUnique({
      where: { userId_groupId: { userId, groupId: group.id } },
    });
    if (existing) throw new ConflictException('Artıq üzvsiniz');

    return this.prisma.groupMember.create({
      data: { userId, groupId: group.id },
    });
  }

  async leave(slug: string, userId: string) {
    const group = await this.prisma.group.findUnique({ where: { slug } });
    if (!group) throw new NotFoundException('Qrup tapılmadı');
    if (group.ownerId === userId) throw new ForbiddenException('Sahibi qrupdan çıxa bilməz');

    await this.prisma.groupMember.delete({
      where: { userId_groupId: { userId, groupId: group.id } },
    });
    return { message: 'Qrupdan çıxdınız' };
  }

  async getMembers(slug: string) {
    const group = await this.prisma.group.findUnique({ where: { slug } });
    if (!group) throw new NotFoundException('Qrup tapılmadı');

    return this.prisma.groupMember.findMany({
      where: { groupId: group.id },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
      orderBy: { joinedAt: 'asc' },
    });
  }
}
