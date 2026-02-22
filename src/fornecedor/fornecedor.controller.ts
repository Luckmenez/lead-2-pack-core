import { Controller, Get, Query } from '@nestjs/common';
import { FornecedorService } from './fornecedor.service';

@Controller('fornecedores')
export class FornecedorController {
  constructor(private readonly fornecedorService: FornecedorService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('categoria') categoria?: string,
  ) {
    return this.fornecedorService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      categoria,
    });
  }
}
