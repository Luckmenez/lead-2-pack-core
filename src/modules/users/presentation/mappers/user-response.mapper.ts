import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { UserResponseDto } from '../dtos/user-response.dto';

export class UserResponseMapper {
  static toResponse(entity: UserEntity): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email.value,
      role: entity.role,
      profileData: entity.profileData,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }


  static toSummary(entity: UserEntity) {
    return {
      id: entity.id,
      email: entity.email.value,
      role: entity.role,
    };
  }
}
