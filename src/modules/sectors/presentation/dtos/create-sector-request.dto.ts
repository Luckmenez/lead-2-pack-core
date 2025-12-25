import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSectorRequestDto {
  @ApiProperty({ example: 'Tecnologia', description: 'Sector name' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Setor de tecnologia e inovação', description: 'Sector description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
