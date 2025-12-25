import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { IsCNPJ } from '../is-cnpj.validator';

export class CustomerProfileDataDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
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
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  website?: string;
}
