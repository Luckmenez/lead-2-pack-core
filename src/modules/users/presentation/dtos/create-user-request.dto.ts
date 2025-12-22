import { IsString, IsEmail, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@shared/types/enums/user-role.enum';

export class CreateUserRequestDto {
  @ApiProperty({ example: 'João Silva', description: 'User full name' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'joao@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123', description: 'User password (min 8 chars, must contain uppercase, lowercase, and number)' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER, description: 'User role' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({ example: 'Embalagens XYZ Ltda', description: 'Company name (required for suppliers)' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;
}
