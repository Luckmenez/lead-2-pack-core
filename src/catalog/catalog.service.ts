import { BadRequestException, Injectable } from '@nestjs/common';
import {
  FORNECEDOR_CATEGORIAS,
  PROFISSIONAL_CATEGORIAS,
} from './categorias-cadastro';

export type CatalogPerfil = 'fornecedor' | 'profissional';

@Injectable()
export class CatalogService {
  getCategorias(perfil: CatalogPerfil): string[] {
    if (perfil === 'fornecedor') {
      return [...FORNECEDOR_CATEGORIAS];
    }
    if (perfil === 'profissional') {
      return [...PROFISSIONAL_CATEGORIAS];
    }
    throw new BadRequestException(
      'perfil deve ser "fornecedor" ou "profissional"',
    );
  }
}
