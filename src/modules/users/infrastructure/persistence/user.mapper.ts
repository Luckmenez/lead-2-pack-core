import { UserEntity } from '../../domain/entities/user.entity';
import { UserSchema } from './user.schema';
import { Email } from '@shared/domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';

export class UserMapper {
  static toDomain(schema: UserSchema): UserEntity {
    return UserEntity.reconstitute({
      id: schema.id,
      name: schema.name,
      email: Email.create(schema.email),
      password: Password.fromHash(schema.password),
      role: schema.role,
      companyName: schema.companyName,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(entity: UserEntity): Partial<UserSchema> {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email.value,
      password: entity.password.value,
      role: entity.role,
      companyName: entity.companyName,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
