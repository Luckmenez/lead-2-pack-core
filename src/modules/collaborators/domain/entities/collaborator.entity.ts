import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '@shared/domain/base-entity';
import { Email } from '@shared/domain/value-objects/email.vo';
import { Password } from '@modules/users/domain/value-objects/password.vo';
import { CollaboratorRole } from '@shared/types/enums/collaborator-role.enum';
import { ValidationException } from '@shared/domain';

interface CreateCollaboratorProps {
  email: Email;
  password: Password;
  name: string;
  role: CollaboratorRole;
}

interface CollaboratorProps extends CreateCollaboratorProps {
  id: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class CollaboratorEntity extends BaseEntity {
  private _email: Email;
  private _password: Password;
  private _name: string;
  private _role: CollaboratorRole;
  private _isActive: boolean;
  private _lastLogin?: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: CollaboratorProps) {
    super(props.id);
    this._email = props.email;
    this._password = props.password;
    this._name = props.name;
    this._role = props.role;
    this._isActive = props.isActive;
    this._lastLogin = props.lastLogin;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this.validate();
  }

  static create(props: CreateCollaboratorProps): CollaboratorEntity {
    const now = new Date();
    return new CollaboratorEntity({
      id: uuidv4(),
      ...props,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: CollaboratorProps): CollaboratorEntity {
    return new CollaboratorEntity(props);
  }

  private validate(): void {
    if (!this._email) {
      throw new ValidationException('Collaborator email cannot be empty');
    }
    if (!this._password) {
      throw new ValidationException('Collaborator password cannot be empty');
    }
    if (!this._name || this._name.trim().length === 0) {
      throw new ValidationException('Collaborator name cannot be empty');
    }
  }

  updateEmail(newEmail: Email): void {
    this._email = newEmail;
    this._updatedAt = new Date();
  }

  updatePassword(newPassword: Password): void {
    this._password = newPassword;
    this._updatedAt = new Date();
  }

  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new ValidationException('Collaborator name cannot be empty');
    }
    this._name = newName;
    this._updatedAt = new Date();
  }

  updateLastLogin(): void {
    this._lastLogin = new Date();
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  isAdmin(): boolean {
    return this._role === CollaboratorRole.ADMIN;
  }

  isSupport(): boolean {
    return this._role === CollaboratorRole.SUPPORT;
  }

  isModerator(): boolean {
    return this._role === CollaboratorRole.MODERATOR;
  }

  get email(): Email {
    return this._email;
  }

  get password(): Password {
    return this._password;
  }

  get name(): string {
    return this._name;
  }

  get role(): CollaboratorRole {
    return this._role;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get lastLogin(): Date | undefined {
    return this._lastLogin;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
