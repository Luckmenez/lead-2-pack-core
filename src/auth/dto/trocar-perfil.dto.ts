import { IsEnum } from 'class-validator';
import { PerfilLoginSelecao } from './login-selecionar-perfil.dto';

export class TrocarPerfilDto {
  @IsEnum(PerfilLoginSelecao, {
    message: 'Perfil deve ser comprador ou fornecedor',
  })
  perfil: PerfilLoginSelecao;
}
