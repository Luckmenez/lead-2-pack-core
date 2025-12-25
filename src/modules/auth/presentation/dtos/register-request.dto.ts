import { IsString, IsEmail, IsEnum, MinLength, MaxLength, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@shared/types/enums/user-role.enum';

export class AuthRegisterRequestDto {
  @ApiProperty({ example: 'joao@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SecurePass123',
    description: 'User password (min 8 chars, must contain uppercase, lowercase, and number)',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER, description: 'User role' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({
    description:
      'Profile data specific to the user role (customer, supplier, or sector professional)',
  })
  @IsObject()
  profileData: Record<string, any>;
}
