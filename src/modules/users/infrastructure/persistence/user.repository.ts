import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserSchema } from './user.schema';
import { UserMapper } from './user.mapper';
import { Email } from '@shared/domain/value-objects/email.vo';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const schema = UserMapper.toPersistence(user);
    const saved = await this.repository.save(schema);
    return UserMapper.toDomain(saved as UserSchema);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? UserMapper.toDomain(schema) : null;
  }

  async findByEmail(email: Email): Promise<UserEntity | null> {
    const schema = await this.repository.findOne({ where: { email: email.value } });
    return schema ? UserMapper.toDomain(schema) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const schemas = await this.repository.find();
    return schemas.map(UserMapper.toDomain);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const schema = UserMapper.toPersistence(user);
    await this.repository.update(user.id, schema);
    const updated = await this.repository.findOne({ where: { id: user.id } });
    if (!updated) {
      throw new Error(`User with id ${user.id} not found after update`);
    }
    return UserMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.repository.count({ where: { email: email.value } });
    return count > 0;
  }
}
