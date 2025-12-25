import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISectorRepository } from '../../../domain/repositories/sector-repository.interface';
import { SectorEntity } from '../../../domain/entities/sector.entity';

@Injectable()
export class GetsectorsByIdUseCase {
  constructor(
    @Inject(ISectorRepository)
    private readonly repository: ISectorRepository,
  ) {}

  async execute(id: string): Promise<SectorEntity> {
    const entity = await this.repository.findById(id);

    if (!entity) {
      throw new NotFoundException('sectors not found');
    }

    return entity;
  }
}
