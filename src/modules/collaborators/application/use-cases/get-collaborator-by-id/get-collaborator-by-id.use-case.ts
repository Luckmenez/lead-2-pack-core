import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CollaboratorEntity } from '../../../domain/entities/collaborator.entity';
import { CollaboratorRepositoryInterface } from '../../../domain/repositories/collaborator-repository.interface';

@Injectable()
export class GetCollaboratorByIdUseCase {
  constructor(
    @Inject('CollaboratorRepositoryInterface')
    private readonly collaboratorRepository: CollaboratorRepositoryInterface,
  ) {}

  async execute(id: string): Promise<CollaboratorEntity> {
    const collaborator = await this.collaboratorRepository.findById(id);

    if (!collaborator) {
      throw new NotFoundException(`Collaborator with id ${id} not found`);
    }

    return collaborator;
  }
}
