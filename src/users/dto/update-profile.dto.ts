import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'alice', description: '3-30 chars, alphanumeric + underscore' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username must be alphanumeric with underscores only' })
  username?: string;

  @ApiPropertyOptional({ example: 'Hey there! I make cool things.', description: 'Max 300 characters' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  bio?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatars/alice.png', description: 'Public URL to avatar image' })
  @IsOptional()
  @IsString()
  avatar?: string;
}
