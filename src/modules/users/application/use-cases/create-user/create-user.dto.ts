import { UserRole } from '@shared/types/enums/user-role.enum';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyName?: string;
}
