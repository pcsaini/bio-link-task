import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseBuilder } from '../utils/response-builder';
import { PublicProfileResource } from '../resources/public-profile.resource';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicProfile(username: string) {
    const now = new Date();

    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        links: {
          where: {
            active: true,
            OR: [{ startTime: null }, { startTime: { lte: now } }],
            AND: [{ OR: [{ endTime: null }, { endTime: { gte: now } }] }],
          },
          orderBy: { order: 'asc' },
          select: { id: true, title: true, url: true, order: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return ResponseBuilder.success(
      { profile: PublicProfileResource.transform(user) },
      'Public profile retrieved successfully',
    );
  }
}
