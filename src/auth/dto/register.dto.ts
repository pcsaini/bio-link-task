import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'alice@example.com', description: 'Valid email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'alice', description: '3-30 chars, alphanumeric + underscore' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username must be alphanumeric with underscores only' })
  username: string;

  @ApiProperty({ example: 'password123', description: 'Min 8 characters' })
  @IsString()
  @MinLength(8)
  password: string;
}
