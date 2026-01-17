import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@shared/types/enums/user-role.enum';
import { UserEntity } from '../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'joao@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
  role: UserRole;

  @ApiPropertyOptional()
  profileData?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Array of sector IDs for SUPPLIER and SECTOR_PROFESSIONAL',
    example: ['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'],
    type: [String],
  })
  sectorIds?: string[];

  @ApiProperty({ example: '2025-12-21T19:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-21T19:00:00.000Z' })
  updatedAt: Date;

  static fromEntity(entity: UserEntity): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email.value,
      role: entity.role,
      profileData: entity.profileData,
      sectorIds: entity.sectorIds,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
