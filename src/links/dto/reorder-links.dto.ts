import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsString, ValidateNested } from 'class-validator';

class ReorderItem {
  @ApiProperty({ example: 'clx5678...', description: 'Link ID' })
  @IsString()
  id: string;

  @ApiProperty({ example: 0, description: 'New order position' })
  @IsInt()
  order: number;
}

export class ReorderLinksDto {
  @ApiProperty({ type: [ReorderItem], description: 'Array of link IDs with new order values' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReorderItem)
  links: ReorderItem[];
}
