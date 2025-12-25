import { ValidationException } from '@shared/domain';

export class CPF {
  private readonly value: string;

  private constructor(cpf: string) {
    this.value = cpf;
  }

  static create(cpf: string): CPF {
    const cleanCPF = this.clean(cpf);
    this.validate(cleanCPF);
    return new CPF(cleanCPF);
  }

  private static clean(cpf: string): string {
    return cpf.replace(/[^\d]/g, '');
  }

  private static validate(cpf: string): void {
    if (!cpf) {
      throw new ValidationException('CPF cannot be empty');
    }

    if (cpf.length !== 11) {
      throw new ValidationException('CPF must have 11 digits');
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      throw new ValidationException('CPF cannot have all digits equal');
    }

    if (!this.isValidCheckDigits(cpf)) {
      throw new ValidationException('Invalid CPF');
    }
  }

  private static isValidCheckDigits(cpf: string): boolean {
    const calculateDigit = (digits: string, factor: number): number => {
      let total = 0;
      for (let i = 0; i < digits.length; i++) {
        total += parseInt(digits[i]) * factor--;
      }
      const remainder = total % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstNineDigits = cpf.substring(0, 9);
    const firstCheckDigit = calculateDigit(firstNineDigits, 10);

    if (firstCheckDigit !== parseInt(cpf[9])) {
      return false;
    }

    const firstTenDigits = cpf.substring(0, 10);
    const secondCheckDigit = calculateDigit(firstTenDigits, 11);

    return secondCheckDigit === parseInt(cpf[10]);
  }

  getValue(): string {
    return this.value;
  }

  getFormatted(): string {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  equals(other: CPF): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
