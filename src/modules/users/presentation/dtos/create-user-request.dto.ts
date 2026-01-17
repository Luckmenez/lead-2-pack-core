import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  IsObject,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@shared/types/enums/user-role.enum';

export class CreateUserRequestDto {
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

  @ApiProperty({
    description:
      'Profile data specific to the user role (customer, supplier, or sector professional)',
  })
  @IsObject()
  profileData: Record<string, any>;

  @ApiPropertyOptional({
    description:
      'Array of sector IDs (UUIDs). Required for SUPPLIER and SECTOR_PROFESSIONAL (1-5 sectors). Not applicable for CUSTOMER.',
    example: [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
    ],
    type: [String],
  })
  @ValidateIf((o) => o.role === UserRole.SUPPLIER || o.role === UserRole.SECTOR_PROFESSIONAL)
  @IsArray()
  @ArrayMinSize(1, { message: 'At least 1 sector is required for SUPPLIER and SECTOR_PROFESSIONAL' })
  @ArrayMaxSize(5, { message: 'Maximum 5 sectors allowed' })
  @IsUUID('4', { each: true, message: 'Each sectorId must be a valid UUID' })
  @ValidateIf((o) => o.role !== UserRole.CUSTOMER)
  sectorIds?: string[];
}
