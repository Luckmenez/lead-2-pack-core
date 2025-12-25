import { CollaboratorEntity } from '../entities/collaborator.entity';

export interface CollaboratorRepositoryInterface {
  save(collaborator: CollaboratorEntity): Promise<CollaboratorEntity>;
  findById(id: string): Promise<CollaboratorEntity | null>;
  findByEmail(email: string): Promise<CollaboratorEntity | null>;
  existsByEmail(email: string): Promise<boolean>;
  findAll(): Promise<CollaboratorEntity[]>;
}
