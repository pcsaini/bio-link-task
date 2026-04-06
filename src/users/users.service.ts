import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResponseBuilder } from '../utils/response-builder';
import { UserResource } from '../resources/user.resource';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return ResponseBuilder.success(
      { user: UserResource.transform(user) },
      'Profile retrieved successfully',
    );
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.username) {
      const existing = await this.prisma.user.findFirst({
        where: { username: dto.username, NOT: { id: userId } },
      });
      if (existing) {
        throw new ConflictException('Username already taken');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
    return ResponseBuilder.success(
      { user: UserResource.transform(user) },
      'Profile updated successfully',
    );
  }

  async updateAvatar(userId: string, filename: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: `/uploads/avatars/${filename}` },
    });
    return ResponseBuilder.success(
      { user: UserResource.transform(user) },
      'Avatar uploaded successfully',
    );
  }
}
