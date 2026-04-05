import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SolicitarContatoDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Mensagem muito longa' })
  mensagem?: string;
}
