import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CPF as CPFValueObject } from '@shared/domain/value-objects/cpf.vo';

@ValidatorConstraint({ async: false })
export class IsCPFConstraint implements ValidatorConstraintInterface {
  validate(cpf: any) {
    if (typeof cpf !== 'string') return false;

    try {
      CPFValueObject.create(cpf);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage() {
    return 'Invalid CPF';
  }
}

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCPFConstraint,
    });
  };
}
