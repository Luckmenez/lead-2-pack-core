import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { AuthenticateCollaboratorDto } from './authenticate-collaborator.dto';
import { CollaboratorEntity } from '../../../domain/entities/collaborator.entity';
import { CollaboratorRepositoryInterface } from '../../../domain/repositories/collaborator-repository.interface';
import { BcryptPasswordHasherService } from '@modules/users/infrastructure/services/bcrypt-password-hasher.service';

@Injectable()
export class AuthenticateCollaboratorUseCase {
  constructor(
    @Inject('CollaboratorRepositoryInterface')
    private readonly collaboratorRepository: CollaboratorRepositoryInterface,
    private readonly passwordHasher: BcryptPasswordHasherService,
  ) {}

  async execute(dto: AuthenticateCollaboratorDto): Promise<CollaboratorEntity> {
    // Busca collaborator por email
    const collaborator = await this.collaboratorRepository.findByEmail(dto.email);

    if (!collaborator) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verifica se está ativo
    if (!collaborator.isActive) {
      throw new UnauthorizedException('Collaborator account is inactive');
    }

    // Valida senha
    const isPasswordValid = await this.passwordHasher.compare(
      dto.password,
      collaborator.password.value,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Atualiza último login
    collaborator.updateLastLogin();
    await this.collaboratorRepository.save(collaborator);

    return collaborator;
  }
}
