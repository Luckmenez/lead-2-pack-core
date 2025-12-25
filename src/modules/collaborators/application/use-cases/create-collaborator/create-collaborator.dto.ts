import { CollaboratorRole } from '@shared/types/enums/collaborator-role.enum';
import { Email } from '@shared/domain/value-objects/email.vo';
import { Password } from '@modules/users/domain/value-objects/password.vo';

export class CreateCollaboratorDto {
  email: Email;
  password: Password;
  name: string;
  role: CollaboratorRole;
}
