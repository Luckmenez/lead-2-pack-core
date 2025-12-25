import { Controller, Get, Post, Patch, Delete, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { CreateSectorUseCase } from '../../application/use-cases/create-sector/create-sector.use-case';
import { GetsectorsByIdUseCase } from '../../application/use-cases/get-sector-by-id/get-sector-by-id.use-case';
import { CreateSectorRequestDto } from '../dtos/create-sector-request.dto';
import { sectorsResponseDto } from '../dtos/sector-response.dto';
import { ApiResponse } from '@shared/types/responses/api-response.interface';

@Controller('sectors')
@ApiTags('sectors')
export class sectorsController {
  constructor(
    private readonly createSectorUseCase: CreateSectorUseCase,
    private readonly getsectorsByIdUseCase: GetsectorsByIdUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sector' })
  @SwaggerResponse({
    status: HttpStatus.CREATED,
    description: 'sectors created successfully',
    type: sectorsResponseDto,
  })
  async create(@Body() dto: CreateSectorRequestDto): Promise<ApiResponse<sectorsResponseDto>> {
    const entity = await this.createSectorUseCase.execute(dto);

    return {
      success: true,
      data: sectorsResponseDto.fromEntity(entity),
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sector by ID' })
  @SwaggerResponse({ status: HttpStatus.OK, description: 'sectors found', type: sectorsResponseDto })
  @SwaggerResponse({ status: HttpStatus.NOT_FOUND, description: 'sectors not found' })
  async getById(@Param('id') id: string): Promise<ApiResponse<sectorsResponseDto>> {
    const entity = await this.getsectorsByIdUseCase.execute(id);

    return {
      success: true,
      data: sectorsResponseDto.fromEntity(entity),
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
