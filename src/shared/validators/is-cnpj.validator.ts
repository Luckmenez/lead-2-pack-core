import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CNPJ as CNPJValueObject } from '@shared/domain/value-objects/cnpj.vo';

@ValidatorConstraint({ async: false })
export class IsCNPJConstraint implements ValidatorConstraintInterface {
  validate(cnpj: any) {
    if (typeof cnpj !== 'string') return false;

    try {
      CNPJValueObject.create(cnpj); // Usa seu VO existente
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage() {
    return 'Invalid CNPJ';
  }
}

export function IsCNPJ(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCNPJConstraint,
    });
  };
}
