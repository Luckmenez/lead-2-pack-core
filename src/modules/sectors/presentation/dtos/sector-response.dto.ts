import { ApiProperty } from '@nestjs/swagger';
import { SectorEntity } from '../../domain/entities/sector.entity';

export class sectorsResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(entity: SectorEntity): sectorsResponseDto {
    const dto = new sectorsResponseDto();
    dto.id = entity.id;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
