import { ValidationException } from '@shared/domain';

export class Password {
  private constructor(private readonly _hashedValue: string) {}

  static create(plainPassword: string): Password {
    this.validate(plainPassword);
    return new Password(plainPassword);
  }

  static fromHash(hashedPassword: string): Password {
    if (!hashedPassword || hashedPassword.trim().length === 0) {
      throw new ValidationException('Hashed password cannot be empty');
    }
    return new Password(hashedPassword);
  }

  private static validate(plainPassword: string): void {
    if (!plainPassword || plainPassword.trim().length === 0) {
      throw new ValidationException('Password cannot be empty');
    }

    if (plainPassword.length < 8) {
      throw new ValidationException('Password must be at least 8 characters long');
    }

    if (plainPassword.length > 100) {
      throw new ValidationException('Password cannot exceed 100 characters');
    }

    const hasUpperCase = /[A-Z]/.test(plainPassword);
    const hasLowerCase = /[a-z]/.test(plainPassword);
    const hasNumber = /[0-9]/.test(plainPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      throw new ValidationException(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      );
    }
  }

  get value(): string {
    return this._hashedValue;
  }

  toJSON(): string {
    return '***REDACTED***';
  }
}
