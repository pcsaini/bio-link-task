import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicService } from './public.service';

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get(':username')
  @ApiOperation({ summary: 'Get public profile with active links' })
  @ApiParam({ name: 'username', description: 'Username to look up' })
  @ApiResponse({ status: 200, description: 'Public profile with filtered active links' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getPublicProfile(@Param('username') username: string) {
    return this.publicService.getPublicProfile(username);
  }
}
