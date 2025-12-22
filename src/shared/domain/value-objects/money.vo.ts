import { ValidationException } from '../exceptions';

export class Money {
  private constructor(private readonly _value: number) {}

  static create(value: number): Money {
    if (value < 0) {
      throw new ValidationException('Money value cannot be negative');
    }

    if (!Number.isFinite(value)) {
      throw new ValidationException('Money value must be finite');
    }

    // Armazena em centavos para evitar problemas de ponto flutuante
    const cents = Math.round(value * 100);
    return new Money(cents);
  }

  static fromCents(cents: number): Money {
    if (cents < 0) {
      throw new ValidationException('Money value cannot be negative');
    }
    const money = Object.create(Money.prototype);
    money._value = cents;
    return money;
  }

  get value(): number {
    return this._value / 100;
  }

  get cents(): number {
    return this._value;
  }

  add(other: Money): Money {
    return Money.fromCents(this._value + other._value);
  }

  subtract(other: Money): Money {
    const result = this._value - other._value;
    if (result < 0) {
      throw new ValidationException('Result cannot be negative');
    }
    return Money.fromCents(result);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new ValidationException('Factor cannot be negative');
    }
    return Money.fromCents(Math.round(this._value * factor));
  }

  equals(other: Money): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  toJSON(): number {
    return this.value;
  }
}
