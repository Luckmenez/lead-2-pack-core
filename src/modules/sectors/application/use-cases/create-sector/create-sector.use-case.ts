import { Injectable, Inject } from '@nestjs/common';
import { ISectorRepository } from '../../../domain/repositories/sector-repository.interface';
import { SectorEntity } from '../../../domain/entities/sector.entity';
import { CreateSectorDto } from './create-sector.dto';

@Injectable()
export class CreateSectorUseCase {
  constructor(
    @Inject(ISectorRepository)
    private readonly repository: ISectorRepository,
  ) {}

  async execute(dto: CreateSectorDto): Promise<SectorEntity> {
    const entity = SectorEntity.create({
      name: dto.name,
      description: dto.description,
    });

    return this.repository.save(entity);
  }
}
