import { UserRole } from '@shared/types/enums/user-role.enum';
import { ProfileData } from '@shared/types/interfaces/profile-data.interface';

export interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
  profileData: ProfileData;
  sectorIds?: string[];
}
