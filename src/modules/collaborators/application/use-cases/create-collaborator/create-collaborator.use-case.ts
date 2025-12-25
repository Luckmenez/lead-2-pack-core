import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { CreateCollaboratorDto } from './create-collaborator.dto';
import { CollaboratorEntity } from '../../../domain/entities/collaborator.entity';
import { CollaboratorRepositoryInterface } from '../../../domain/repositories/collaborator-repository.interface';

@Injectable()
export class CreateCollaboratorUseCase {
  constructor(
    @Inject('CollaboratorRepositoryInterface')
    private readonly collaboratorRepository: CollaboratorRepositoryInterface,
  ) {}

  async execute(dto: CreateCollaboratorDto): Promise<CollaboratorEntity> {
    // Verifica se o email já existe
    const emailExists = await this.collaboratorRepository.existsByEmail(dto.email.value);
    if (emailExists) {
      throw new ConflictException('Email already in use');
    }

    // Cria a entity
    const collaborator = CollaboratorEntity.create({
      email: dto.email,
      password: dto.password,
      name: dto.name,
      role: dto.role,
    });

    // Salva no repositório
    return await this.collaboratorRepository.save(collaborator);
  }
}
