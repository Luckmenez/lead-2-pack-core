import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { RegisterResponseDto } from '../dtos/register-response.dto';

export class AuthResponseMapper {
  static toAuthResponse(entity: UserEntity, accessToken: string): AuthResponseDto {
    return {
      userId: entity.id,
      email: entity.email.value,
      role: entity.role,
      accessToken,
    };
  }

  static toRegisterResponse(entity: UserEntity, accessToken: string): RegisterResponseDto {
    return {
      userId: entity.id,
      email: entity.email.value,
      role: entity.role,
      profileData: entity.profileData,
      accessToken,
    };
  }
}
