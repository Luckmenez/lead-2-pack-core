import { UserEntity } from '../../domain/entities/user.entity';
import { UserSchema } from './user.schema';
import { Email } from '@shared/domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';

export class UserMapper {
  static toDomain(schema: UserSchema): UserEntity {
    return UserEntity.reconstitute({
      id: schema.id,
      email: Email.create(schema.email),
      password: Password.fromHash(schema.password),
      role: schema.role,
      profileData: schema.profile_data,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(entity: UserEntity): Partial<UserSchema> {
    return {
      id: entity.id,
      email: entity.email.value,
      password: entity.password.value,
      role: entity.role,
      profile_data: entity.profileData,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
