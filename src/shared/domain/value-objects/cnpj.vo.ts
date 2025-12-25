import { ValidationException } from '@shared/domain';

export class CNPJ {
  private readonly value: string;

  private constructor(cnpj: string) {
    this.value = cnpj;
  }

  static create(cnpj: string): CNPJ {
    const cleanCNPJ = this.clean(cnpj);
    this.validate(cleanCNPJ);
    return new CNPJ(cleanCNPJ);
  }

  private static clean(cnpj: string): string {
    return cnpj.replace(/[^\d]/g, '');
  }

  private static validate(cnpj: string): void {
    if (!cnpj) {
      throw new ValidationException('CNPJ cannot be empty');
    }

    if (cnpj.length !== 14) {
      throw new ValidationException('CNPJ must have 14 digits');
    }

    if (/^(\d)\1{13}$/.test(cnpj)) {
      throw new ValidationException('CNPJ cannot have all digits equal');
    }

    if (!this.isValidCheckDigits(cnpj)) {
      throw new ValidationException('Invalid CNPJ');
    }
  }

  private static isValidCheckDigits(cnpj: string): boolean {
    const calculateDigit = (digits: string): number => {
      const weights = digits.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

      let total = 0;
      for (let i = 0; i < digits.length; i++) {
        total += parseInt(digits[i]) * weights[i];
      }

      const remainder = total % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstTwelveDigits = cnpj.substring(0, 12);
    const firstCheckDigit = calculateDigit(firstTwelveDigits);

    if (firstCheckDigit !== parseInt(cnpj[12])) {
      return false;
    }

    const firstThirteenDigits = cnpj.substring(0, 13);
    const secondCheckDigit = calculateDigit(firstThirteenDigits);

    return secondCheckDigit === parseInt(cnpj[13]);
  }

  getValue(): string {
    return this.value;
  }

  getFormatted(): string {
    return this.value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  equals(other: CNPJ): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
