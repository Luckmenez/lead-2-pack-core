import { CollaboratorEntity } from '../../domain/entities/collaborator.entity';
import { CollaboratorSchema } from './collaborator.schema';
import { Email } from '@shared/domain/value-objects/email.vo';
import { Password } from '@modules/users/domain/value-objects/password.vo';

export class CollaboratorMapper {
  static toDomain(schema: CollaboratorSchema): CollaboratorEntity {
    return CollaboratorEntity.reconstitute({
      id: schema.id,
      email: Email.create(schema.email),
      password: Password.fromHash(schema.password),
      name: schema.name,
      role: schema.role,
      isActive: schema.is_active,
      lastLogin: schema.last_login,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(entity: CollaboratorEntity): Partial<CollaboratorSchema> {
    return {
      id: entity.id,
      email: entity.email.value,
      password: entity.password.value,
      name: entity.name,
      role: entity.role,
      is_active: entity.isActive,
      last_login: entity.lastLogin,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
