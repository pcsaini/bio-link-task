import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LinksModule } from './links/links.module';
import { PublicModule } from './public/public.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, LinksModule, PublicModule],
})
export class AppModule {}
