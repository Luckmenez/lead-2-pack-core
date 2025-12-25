import { ApiProperty } from '@nestjs/swagger';
import { CollaboratorRole } from '@shared/types/enums/collaborator-role.enum';

export class CollaboratorResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'admin@lead2pack.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ enum: CollaboratorRole, example: CollaboratorRole.ADMIN })
  role: CollaboratorRole;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', required: false })
  lastLogin?: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: string;
}
