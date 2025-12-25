import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Infrastructure
import { SectorSchema } from './infrastructure/persistence/sector.schema';
import { sectorsRepository } from './infrastructure/persistence/sector.repository';

// Domain
import { ISectorRepository } from './domain/repositories/sector-repository.interface';

// Application
import { CreateSectorUseCase } from './application/use-cases/create-sector/create-sector.use-case';
import { GetsectorsByIdUseCase } from './application/use-cases/get-sector-by-id/get-sector-by-id.use-case';

// Presentation
import { sectorsController } from './presentation/controllers/sectors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SectorSchema])],
  controllers: [sectorsController],
  providers: [
    // Repository
    {
      provide: ISectorRepository,
      useClass: sectorsRepository,
    },

    // Use Cases
    CreateSectorUseCase,
    GetsectorsByIdUseCase,
  ],
  exports: [ISectorRepository, GetsectorsByIdUseCase],
})
export class sectorsModule {}
