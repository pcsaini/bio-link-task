import { ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseBuilder } from '../utils/response-builder';
import { UserResource } from '../resources/user.resource';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (existing) {
      throw new ConflictException('Email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: hashedPassword,
      },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return ResponseBuilder.asSuccess(HttpStatus.CREATED)
      .withMessage('User registered successfully')
      .with('access_token', token)
      .withData({ user: UserResource.transform(user) })
      .build();
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return ResponseBuilder.asSuccess()
      .withMessage('Login successful')
      .with('access_token', token)
      .withData({ user: UserResource.transform(user) })
      .build();
  }

  async getMe(user: any) {
    return ResponseBuilder.success(
      { user: UserResource.transform(user) },
      'User profile retrieved successfully',
    );
  }
}
