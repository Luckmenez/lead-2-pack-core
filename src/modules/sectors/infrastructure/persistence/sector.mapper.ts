import { SectorEntity } from '../../domain/entities/sector.entity';
import { SectorSchema } from './sector.schema';

export class SectorMapper {
  static toDomain(schema: SectorSchema): SectorEntity {
    return SectorEntity.reconstitute({
      id: schema.id,
      name: schema.name,
      description: schema.description,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(entity: SectorEntity): SectorSchema {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
