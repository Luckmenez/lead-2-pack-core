import { UserEntity } from '../entities/user.entity';
import { Email } from '@shared/domain/value-objects/email.vo';

export abstract class IUserRepository {
  abstract save(user: UserEntity): Promise<UserEntity>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: Email): Promise<UserEntity | null>;
  abstract findAll(): Promise<UserEntity[]>;
  abstract update(user: UserEntity): Promise<UserEntity>;
  abstract delete(id: string): Promise<void>;
  abstract existsByEmail(email: Email): Promise<boolean>;
}
