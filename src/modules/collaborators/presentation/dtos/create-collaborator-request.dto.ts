import { IsEmail, IsString, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CollaboratorRole } from '@shared/types/enums/collaborator-role.enum';

export class CreateCollaboratorRequestDto {
  @ApiProperty({ example: 'admin@lead2pack.com', description: 'Collaborator email address' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SecurePass123',
    description: 'Collaborator password (min 8 chars)',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Collaborator full name' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    enum: CollaboratorRole,
    example: CollaboratorRole.ADMIN,
    description: 'Collaborator role',
  })
  @IsEnum(CollaboratorRole)
  role: CollaboratorRole;
}
