import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { ReorderLinksDto } from './dto/reorder-links.dto';

@ApiTags('links')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  @ApiOperation({ summary: 'List all user links (ordered by order asc)' })
  findAll(@Request() req) {
    return this.linksService.findAll(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new link' })
  @ApiResponse({ status: 201, description: 'Link created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Request() req, @Body() dto: CreateLinkDto) {
    return this.linksService.create(req.user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single link by ID' })
  @ApiParam({ name: 'id', description: 'Link CUID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.linksService.getOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update link fields' })
  @ApiParam({ name: 'id', description: 'Link CUID' })
  update(@Param('id') id: string, @Request() req, @Body() dto: UpdateLinkDto) {
    return this.linksService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a link' })
  @ApiParam({ name: 'id', description: 'Link CUID' })
  remove(@Param('id') id: string, @Request() req) {
    return this.linksService.remove(id, req.user.id);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle link active/inactive' })
  @ApiParam({ name: 'id', description: 'Link CUID' })
  toggle(@Param('id') id: string, @Request() req) {
    return this.linksService.toggle(id, req.user.id);
  }

  @Patch('reorder')
  @ApiOperation({ summary: 'Persist new sort order' })
  reorder(@Request() req, @Body() dto: ReorderLinksDto) {
    return this.linksService.reorder(req.user.id, dto);
  }
}
