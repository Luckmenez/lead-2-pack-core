import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CollaboratorLoginRequestDto {
  @ApiProperty({ example: 'admin@lead2pack.com', description: 'Collaborator email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123', description: 'Collaborator password' })
  @IsString()
  password: string;
}
