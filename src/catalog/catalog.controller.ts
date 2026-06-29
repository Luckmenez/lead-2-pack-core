import { Controller, Get, Param } from '@nestjs/common';
import { CatalogService, CatalogPerfil } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('categorias/:perfil')
  getCategorias(@Param('perfil') perfil: string) {
    const categorias = this.catalogService.getCategorias(perfil as CatalogPerfil);
    return { perfil, categorias };
  }
}
