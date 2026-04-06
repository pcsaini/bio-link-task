import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { ReorderLinksDto } from './dto/reorder-links.dto';
import { ResponseBuilder } from '../utils/response-builder';
import { LinkResource } from '../resources/link.resource';

@Injectable()
export class LinksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const links = await this.prisma.link.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
    return ResponseBuilder.success(
      { links: LinkResource.collection(links) },
      'Links retrieved successfully',
    );
  }

  async findOne(id: string, userId: string) {
    const link = await this.prisma.link.findUnique({ where: { id } });
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    if (link.userId !== userId) {
      throw new ForbiddenException('Not your link');
    }
    return link;
  }

  async getOne(id: string, userId: string) {
    const link = await this.findOne(id, userId);
    return ResponseBuilder.success(
      { link: LinkResource.transform(link) },
      'Link retrieved successfully',
    );
  }

  async create(userId: string, dto: CreateLinkDto) {
    const data: any = {
      title: dto.title,
      url: dto.url,
      userId,
    };

    if (dto.active !== undefined) data.active = dto.active;
    if (dto.order !== undefined) {
      data.order = dto.order;
    } else {
      const count = await this.prisma.link.count({ where: { userId } });
      data.order = count;
    }
    if (dto.startTime) data.startTime = new Date(dto.startTime);
    if (dto.endTime) data.endTime = new Date(dto.endTime);

    const link = await this.prisma.link.create({ data });
    return ResponseBuilder.asSuccess(HttpStatus.CREATED)
      .withMessage('Link created successfully')
      .withData({ link: LinkResource.transform(link) })
      .build();
  }

  async update(id: string, userId: string, dto: UpdateLinkDto) {
    await this.findOne(id, userId);

    const data: any = { ...dto };
    if (dto.startTime) data.startTime = new Date(dto.startTime);
    if (dto.endTime) data.endTime = new Date(dto.endTime);

    const link = await this.prisma.link.update({ where: { id }, data });
    return ResponseBuilder.success(
      { link: LinkResource.transform(link) },
      'Link updated successfully',
    );
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.link.delete({ where: { id } });
    return ResponseBuilder.success(null, 'Link deleted successfully');
  }

  async toggle(id: string, userId: string) {
    const existing = await this.findOne(id, userId);
    const link = await this.prisma.link.update({
      where: { id },
      data: { active: !existing.active },
    });
    return ResponseBuilder.success(
      { link: LinkResource.transform(link) },
      'Link toggled successfully',
    );
  }

  async reorder(userId: string, dto: ReorderLinksDto) {
    await this.prisma.$transaction(
      dto.links.map(({ id, order }) =>
        this.prisma.link.update({
          where: { id, userId },
          data: { order },
        }),
      ),
    );
    return ResponseBuilder.success(null, 'Links reordered successfully');
  }
}
