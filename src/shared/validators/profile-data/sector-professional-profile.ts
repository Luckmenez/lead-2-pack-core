import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { IsCPF } from '@shared/validators/is-cpf.validator';

export class SectorProfessionalProfileDataDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  tradeName?: string;

  @IsCPF()
  cpf: string;

  @IsEmail()
  corporateEmail: string;

  @IsString()
  @IsNotEmpty()
  whatsapp: string;

  @IsString()
  @IsOptional()
  address?: string;
}
