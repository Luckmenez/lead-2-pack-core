import { SectorEntity } from '../entities/sector.entity';

export abstract class ISectorRepository {
  abstract findById(id: string): Promise<SectorEntity | null>;
  abstract findByIds(ids: string[]): Promise<SectorEntity[]>;
  abstract save(entity: SectorEntity): Promise<SectorEntity>;
  abstract update(entity: SectorEntity): Promise<SectorEntity>;
  abstract delete(id: string): Promise<void>;
}
