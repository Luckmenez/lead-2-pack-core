import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProfileData } from '@shared/types/interfaces/profile-data.interface';

export class RegisterResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ example: 'joao@example.com' })
  email: string;

  @ApiProperty({ example: 'CUSTOMER' })
  role: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: { firstName: 'Joao', lastName: 'Silva' } })
  profileData: ProfileData;

  @ApiPropertyOptional({
    description: 'Array of sector IDs for SUPPLIER and SECTOR_PROFESSIONAL',
    example: ['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'],
    type: [String],
  })
  sectorIds?: string[];
}
