import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '@shared/domain/base-entity';
import { ValidationException } from '@shared/domain';

interface CreateSectorProps {
  name: string;
  description?: string;
}

interface SectorProps extends CreateSectorProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SectorEntity extends BaseEntity {
  private _name: string;
  private _description?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: SectorProps) {
    super(props.id);
    this._name = props.name;
    this._description = props.description;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this.validate();
  }

  static create(props: CreateSectorProps): SectorEntity {
    const now = new Date();
    return new SectorEntity({
      id: uuidv4(),
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: SectorProps): SectorEntity {
    return new SectorEntity(props);
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new ValidationException('Sector name cannot be empty');
    }

    if (this._name.length < 2) {
      throw new ValidationException('Sector name must be at least 2 characters long');
    }

    if (this._name.length > 100) {
      throw new ValidationException('Sector name cannot exceed 100 characters');
    }

    if (this._description && this._description.length > 500) {
      throw new ValidationException('Sector description cannot exceed 500 characters');
    }
  }

  updateName(newName: string): void {
    this._name = newName;
    this._updatedAt = new Date();
    this.validate();
  }

  updateDescription(newDescription: string | undefined): void {
    this._description = newDescription;
    this._updatedAt = new Date();
    this.validate();
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
