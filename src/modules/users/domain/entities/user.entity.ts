import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '@shared/domain/base-entity';
import { Email } from '@shared/domain/value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { UserRole } from '@shared/types/enums/user-role.enum';
import { DomainException, ValidationException } from '@shared/domain';

interface CreateUserProps {
  name: string;
  email: Email;
  password: Password;
  role: UserRole;
  companyName?: string;
}

interface UserProps extends CreateUserProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity extends BaseEntity {
  private _name: string;
  private _email: Email;
  private _password: Password;
  private _role: UserRole;
  private _companyName?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    super(props.id);
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._role = props.role;
    this._companyName = props.companyName;
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
    if (!this._name || this._name.trim().length === 0) {
      throw new ValidationException('User name cannot be empty');
    }

    if (this._name.length < 3) {
      throw new ValidationException('User name must be at least 3 characters long');
    }

    if (this._name.length > 100) {
      throw new ValidationException('User name cannot exceed 100 characters');
    }

    if (this._role === UserRole.SUPPLIER && !this._companyName) {
      throw new DomainException('Supplier must have a company name');
    }

    if (this._companyName && this._companyName.trim().length === 0) {
      throw new ValidationException('Company name cannot be empty if provided');
    }
  }

  updateName(newName: string): void {
    this._name = newName;
    this._updatedAt = new Date();
    this.validate();
  }

  updateEmail(newEmail: Email): void {
    this._email = newEmail;
    this._updatedAt = new Date();
  }

  updatePassword(newPassword: Password): void {
    this._password = newPassword;
    this._updatedAt = new Date();
  }

  updateCompanyName(companyName: string): void {
    this._companyName = companyName;
    this._updatedAt = new Date();
    this.validate();
  }

  isSupplier(): boolean {
    return this._role === UserRole.SUPPLIER;
  }

  isCustomer(): boolean {
    return this._role === UserRole.CUSTOMER;
  }

  isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }

  get name(): string {
    return this._name;
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

  get companyName(): string | undefined {
    return this._companyName;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
