import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISectorRepository } from '../../domain/repositories/sector-repository.interface';
import { SectorEntity } from '../../domain/entities/sector.entity';
import { SectorSchema } from './sector.schema';
import { SectorMapper } from './sector.mapper';

@Injectable()
export class sectorsRepository implements ISectorRepository {
  constructor(
    @InjectRepository(SectorSchema)
    private readonly repository: Repository<SectorSchema>,
  ) {}

  async findById(id: string): Promise<SectorEntity | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? SectorMapper.toDomain(schema) : null;
  }

  async save(entity: SectorEntity): Promise<SectorEntity> {
    const schema = SectorMapper.toPersistence(entity);
    const saved = await this.repository.save(schema);
    return SectorMapper.toDomain(saved);
  }

  async update(entity: SectorEntity): Promise<SectorEntity> {
    const schema = SectorMapper.toPersistence(entity);
    const updated = await this.repository.save(schema);
    return SectorMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
