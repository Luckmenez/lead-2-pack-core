import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '@shared/domain/base-entity';
import { Email } from '@shared/domain/value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { UserRole } from '@shared/types/enums/user-role.enum';
import { DomainException, ValidationException } from '@shared/domain';
import { ProfileData } from '@shared/types/interfaces/profile-data.interface';

interface CreateUserProps {
  email: Email;
  password: Password;
  role: UserRole;
  profileData?: ProfileData;
}

interface UserProps extends CreateUserProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity extends BaseEntity {
  private _email: Email;
  private _password: Password;
  private _role: UserRole;
  private _profileData?: ProfileData;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    super(props.id);
    this._email = props.email;
    this._password = props.password;
    this._role = props.role;
    this._profileData = props.profileData;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this.validate();
  }

  static create(props: CreateUserProps): UserEntity {
    const now = new Date();
    return new UserEntity({
      id: uuidv4(),
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: UserProps): UserEntity {
    return new UserEntity(props);
  }

  private validate(): void {
    // Validação básica - validações específicas de profileData são feitas nos DTOs
    if (!this._email) {
      throw new ValidationException('User email cannot be empty');
    }
    if (!this._password) {
      throw new ValidationException('User password cannot be empty');
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

  updateProfileData(profileData: ProfileData): void {
    this._profileData = profileData;
    this._updatedAt = new Date();
  }

  isSupplier(): boolean {
    return this._role === UserRole.SUPPLIER;
  }

  isCustomer(): boolean {
    return this._role === UserRole.CUSTOMER;
  }

  isSectorProfessional(): boolean {
    return this._role === UserRole.SECTOR_PROFESSIONAL;
  }

  isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }

  get email(): Email {
    return this._email;
  }

  get password(): Password {
    return this._password;
  }

  get role(): UserRole {
    return this._role;
  }

  get profileData(): ProfileData | undefined {
    return this._profileData;
  }

  /**
   * Type guard para garantir que o usuário tem profileData
   * Útil em contextos onde profileData é obrigatório (ex: após registro)
   */
  hasProfileData(): this is UserEntity & { profileData: ProfileData } {
    return this._profileData !== undefined;
  }

  /**
   * Retorna profileData com garantia de tipo
   * @throws {DomainException} se profileData não estiver definido
   */
  getRequiredProfileData(): ProfileData {
    if (!this._profileData) {
      throw new DomainException('ProfileData is required but not set');
    }
    return this._profileData;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
