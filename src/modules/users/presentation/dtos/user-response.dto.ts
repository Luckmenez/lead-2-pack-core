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
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
