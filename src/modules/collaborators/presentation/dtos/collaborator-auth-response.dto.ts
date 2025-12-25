import { ApiProperty } from '@nestjs/swagger';
import { CollaboratorRole } from '@shared/types/enums/collaborator-role.enum';

export class CollaboratorAuthResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  collaboratorId: string;

  @ApiProperty({ example: 'admin@lead2pack.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ enum: CollaboratorRole, example: CollaboratorRole.ADMIN })
  role: CollaboratorRole;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;
}
