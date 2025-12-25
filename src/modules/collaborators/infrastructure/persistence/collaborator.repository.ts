import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollaboratorRepositoryInterface } from '../../domain/repositories/collaborator-repository.interface';
import { CollaboratorEntity } from '../../domain/entities/collaborator.entity';
import { CollaboratorSchema } from './collaborator.schema';
import { CollaboratorMapper } from './collaborator.mapper';

@Injectable()
export class CollaboratorRepository implements CollaboratorRepositoryInterface {
  constructor(
    @InjectRepository(CollaboratorSchema)
    private readonly repository: Repository<CollaboratorSchema>,
  ) {}

  async save(collaborator: CollaboratorEntity): Promise<CollaboratorEntity> {
    const schema = CollaboratorMapper.toPersistence(collaborator);
    const saved = await this.repository.save(schema);
    return CollaboratorMapper.toDomain(saved as CollaboratorSchema);
  }

  async findById(id: string): Promise<CollaboratorEntity | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? CollaboratorMapper.toDomain(schema) : null;
  }

  async findByEmail(email: string): Promise<CollaboratorEntity | null> {
    const schema = await this.repository.findOne({ where: { email } });
    return schema ? CollaboratorMapper.toDomain(schema) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  async findAll(): Promise<CollaboratorEntity[]> {
    const schemas = await this.repository.find();
    return schemas.map(CollaboratorMapper.toDomain);
  }
}
