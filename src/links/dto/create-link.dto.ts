import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @ApiProperty({ example: 'My Portfolio', description: 'Display title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://alice.dev', description: 'Destination URL' })
  @IsUrl()
  url: string;

  @ApiPropertyOptional({ example: true, description: 'Defaults to true' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ example: 0, description: 'Integer position; auto-assigned if omitted' })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00Z', description: 'Link is hidden before this time' })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({ example: '2025-12-31T23:59:59Z', description: 'Link is hidden after this time' })
  @IsOptional()
  @IsDateString()
  endTime?: string;
}
