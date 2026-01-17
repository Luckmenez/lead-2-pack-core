import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserSchema } from './user.schema';
import { UserMapper } from './user.mapper';
import { Email } from '@shared/domain/value-objects/email.vo';
import { SectorSchema } from '@modules/sectors/infrastructure/persistence/sector.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
    @InjectRepository(SectorSchema)
    private readonly sectorRepository: Repository<SectorSchema>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const schema = UserMapper.toPersistence(user);

    // If sectorIds are provided, load the full sector entities
    if (user.sectorIds && user.sectorIds.length > 0) {
      const sectors = await this.sectorRepository.find({
        where: { id: In(user.sectorIds) },
      });
      schema.sectors = sectors;
    }

    const saved = await this.repository.save(schema);

    // Reload with relations to get the sectors
    const reloaded = await this.repository.findOne({
      where: { id: saved.id },
      relations: ['sectors'],
    });

    return UserMapper.toDomain(reloaded as UserSchema);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const schema = await this.repository.findOne({
      where: { id },
      relations: ['sectors'],
    });
    return schema ? UserMapper.toDomain(schema) : null;
  }

  async findByEmail(email: Email): Promise<UserEntity | null> {
    const schema = await this.repository.findOne({
      where: { email: email.value },
      relations: ['sectors'],
    });
    return schema ? UserMapper.toDomain(schema) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const schemas = await this.repository.find({
      relations: ['sectors'],
    });
    return schemas.map(UserMapper.toDomain);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const schema = UserMapper.toPersistence(user);

    // If sectorIds are provided, load the full sector entities
    if (user.sectorIds && user.sectorIds.length > 0) {
      const sectors = await this.sectorRepository.find({
        where: { id: In(user.sectorIds) },
      });
      schema.sectors = sectors;
    } else {
      // Clear sectors if no sectorIds provided
      schema.sectors = [];
    }

    await this.repository.save(schema); // Use save instead of update to handle relations
    const updated = await this.repository.findOne({
      where: { id: user.id },
      relations: ['sectors'],
    });
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
