import { ValidationException } from '../exceptions';

export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Email {
    if (!value || value.trim().length === 0) {
      throw new ValidationException('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new ValidationException('Invalid email format');
    }

    return new Email(value.toLowerCase().trim());
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  toJSON(): string {
    return this._value;
  }
}
