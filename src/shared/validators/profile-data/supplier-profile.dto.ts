import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { IsCNPJ } from '@shared/validators/is-cnpj.validator';

export class SupplierProfileDataDto {
  @IsString()
  @IsNotEmpty()
  companyFullName: string;

  @IsString()
  @IsNotEmpty()
  legalName: string;

  @IsString()
  @IsNotEmpty()
  tradeName: string;

  @IsCNPJ()
  cnpj: string;

  @IsEmail()
  corporateEmail: string;

  @IsString()
  @IsNotEmpty()
  whatsapp: string;

  @IsString()
  @IsNotEmpty()
  contactName: string;

  @IsString()
  @IsOptional()
  address?: string;
}
