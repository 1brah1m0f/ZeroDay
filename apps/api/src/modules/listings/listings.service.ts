import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateListingDto, UpdateListingDto } from './dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) { }

  async findAll(params: { page?: number | string; limit?: number | string; category?: string; q?: string }) {
    const page = Math.max(1, parseInt(String(params.page || '1'), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(params.limit || '20'), 10)));
    const { category, q } = params;
    const skip = (page - 1) * limit;

    const where: any = { status: 'ACTIVE' };
    if (category) where.category = category;
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
      }),
      this.prisma.listing.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });
    if (!listing) throw new NotFoundException('Elan tapılmadı');

    // Increment view count
    await this.prisma.listing.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return listing;
  }

  async create(userId: string, dto: CreateListingDto) {
    return this.prisma.listing.create({
      data: {
        ...dto,
        tags: JSON.stringify(dto.tags || []),
        images: JSON.stringify(dto.images || []),
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateListingDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Elan tapılmadı');
    if (listing.authorId !== userId) throw new ForbiddenException('Bu elan sizin deyil');

    const data: any = { ...dto };
    if (dto.tags) data.tags = JSON.stringify(dto.tags);
    if (dto.images) data.images = JSON.stringify(dto.images);

    return this.prisma.listing.update({
      where: { id },
      data,
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Elan tapılmadı');
    if (listing.authorId !== userId) throw new ForbiddenException('Bu elan sizin deyil');

    await this.prisma.listing.delete({ where: { id } });
    return { message: 'Elan silindi' };
  }

  async findByUser(userId: string) {
    return this.prisma.listing.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });
  }

  // --- Applications ---
  async applyToListing(listingId: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Elan tapılmadı');
    if (listing.authorId === userId) throw new ForbiddenException('Öz elanınıza müraciət edə bilməzsiniz');

    const existing = await this.prisma.application.findUnique({
      where: { listingId_applicantId: { listingId, applicantId: userId } },
    });
    if (existing) throw new ForbiddenException('Artıq müraciət etmisiniz');

    return this.prisma.application.create({
      data: {
        listingId,
        applicantId: userId,
        ownerId: listing.authorId,
      },
    });
  }

  async getMyApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { applicantId: userId },
      include: { listing: true },
    });
  }

  async getReceivedApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { ownerId: userId },
      include: {
        listing: { select: { id: true, title: true } },
        applicant: { select: { id: true, displayName: true, avatarUrl: true, username: true } },
      },
    });
  }

  async updateApplicationStatus(appId: string, userId: string, status: string) {
    const app = await this.prisma.application.findUnique({ where: { id: appId } });
    if (!app) throw new NotFoundException('Müraciət tapılmadı');
    if (app.ownerId !== userId) throw new ForbiddenException('İcazə yoxdur');

    return this.prisma.application.update({
      where: { id: appId },
      data: { status },
    });
  }

  async deleteApplication(appId: string, userId: string) {
    const app = await this.prisma.application.findUnique({ where: { id: appId } });
    if (!app) throw new NotFoundException('Müraciət tapılmadı');
    if (app.applicantId !== userId) throw new ForbiddenException('İcazə yoxdur');

    await this.prisma.application.delete({ where: { id: appId } });
    return { message: 'Müraciət silindi' };
  }

  // --- Saved Listings ---
  async toggleSavedListing(listingId: string, userId: string) {
    const existing = await this.prisma.savedListing.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });

    if (existing) {
      await this.prisma.savedListing.delete({ where: { id: existing.id } });
      return { saved: false };
    } else {
      await this.prisma.savedListing.create({ data: { userId, listingId } });
      return { saved: true };
    }
  }

  async getSavedListings(userId: string) {
    return this.prisma.savedListing.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            author: { select: { id: true, displayName: true, avatarUrl: true, username: true } },
            _count: { select: { applications: true } }
          }
        },
      },
    });
  }
}
