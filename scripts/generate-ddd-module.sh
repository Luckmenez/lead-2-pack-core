#!/bin/bash

# Script para gerar estrutura de módulo DDD
# Uso: ./scripts/generate-ddd-module.sh <module-name>

if [ -z "$1" ]; then
  echo "❌ Erro: Nome do módulo é obrigatório"
  echo "Uso: ./scripts/generate-ddd-module.sh <module-name>"
  echo "Exemplo: ./scripts/generate-ddd-module.sh products"
  exit 1
fi

MODULE_NAME=$1
MODULE_NAME_LOWER=$(echo "$MODULE_NAME" | tr '[:upper:]' '[:lower:]')
MODULE_NAME_PASCAL=$(echo "$MODULE_NAME_LOWER" | sed 's/\b\w/\u&/g')
MODULE_NAME_SINGULAR=$(echo "$MODULE_NAME_LOWER" | sed 's/s$//')

BASE_PATH="src/modules/$MODULE_NAME_LOWER"

echo "🚀 Gerando módulo DDD: $MODULE_NAME_PASCAL"
echo "📁 Caminho: $BASE_PATH"

# Criar estrutura de pastas
echo "📂 Criando estrutura de pastas..."
mkdir -p "$BASE_PATH/domain/entities"
mkdir -p "$BASE_PATH/domain/repositories"
mkdir -p "$BASE_PATH/domain/value-objects"
mkdir -p "$BASE_PATH/application/use-cases/create-$MODULE_NAME_SINGULAR"
mkdir -p "$BASE_PATH/application/use-cases/get-$MODULE_NAME_SINGULAR-by-id"
mkdir -p "$BASE_PATH/application/use-cases/update-$MODULE_NAME_SINGULAR"
mkdir -p "$BASE_PATH/application/use-cases/delete-$MODULE_NAME_SINGULAR"
mkdir -p "$BASE_PATH/infrastructure/persistence"
mkdir -p "$BASE_PATH/infrastructure/services"
mkdir -p "$BASE_PATH/presentation/controllers"
mkdir -p "$BASE_PATH/presentation/dtos"

echo "📝 Gerando arquivos..."

# ============= DOMAIN LAYER =============

# Entity
cat > "$BASE_PATH/domain/entities/$MODULE_NAME_SINGULAR.entity.ts" << EOF
export class ${MODULE_NAME_PASCAL}Entity {
  private constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): ${MODULE_NAME_PASCAL}Entity {
    return new ${MODULE_NAME_PASCAL}Entity(
      props.id,
      props.createdAt || new Date(),
      props.updatedAt || new Date(),
    );
  }

  static reconstitute(props: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }): ${MODULE_NAME_PASCAL}Entity {
    return new ${MODULE_NAME_PASCAL}Entity(
      props.id,
      props.createdAt,
      props.updatedAt,
    );
  }
}
EOF

# Repository Interface
cat > "$BASE_PATH/domain/repositories/$MODULE_NAME_SINGULAR-repository.interface.ts" << EOF
import { ${MODULE_NAME_PASCAL}Entity } from '../entities/$MODULE_NAME_SINGULAR.entity';

export abstract class I${MODULE_NAME_PASCAL}Repository {
  abstract findById(id: string): Promise<${MODULE_NAME_PASCAL}Entity | null>;
  abstract save(entity: ${MODULE_NAME_PASCAL}Entity): Promise<${MODULE_NAME_PASCAL}Entity>;
  abstract update(entity: ${MODULE_NAME_PASCAL}Entity): Promise<${MODULE_NAME_PASCAL}Entity>;
  abstract delete(id: string): Promise<void>;
}
EOF

# ============= APPLICATION LAYER =============

# Create Use Case
cat > "$BASE_PATH/application/use-cases/create-$MODULE_NAME_SINGULAR/create-$MODULE_NAME_SINGULAR.dto.ts" << EOF
export interface Create${MODULE_NAME_PASCAL}Dto {
  // Add your properties here
}
EOF

cat > "$BASE_PATH/application/use-cases/create-$MODULE_NAME_SINGULAR/create-$MODULE_NAME_SINGULAR.use-case.ts" << EOF
import { Injectable, Inject } from '@nestjs/common';
import { I${MODULE_NAME_PASCAL}Repository } from '../../../domain/repositories/$MODULE_NAME_SINGULAR-repository.interface';
import { ${MODULE_NAME_PASCAL}Entity } from '../../../domain/entities/$MODULE_NAME_SINGULAR.entity';
import { Create${MODULE_NAME_PASCAL}Dto } from './create-$MODULE_NAME_SINGULAR.dto';

@Injectable()
export class Create${MODULE_NAME_PASCAL}UseCase {
  constructor(
    @Inject(I${MODULE_NAME_PASCAL}Repository)
    private readonly repository: I${MODULE_NAME_PASCAL}Repository,
  ) {}

  async execute(dto: Create${MODULE_NAME_PASCAL}Dto): Promise<${MODULE_NAME_PASCAL}Entity> {
    // TODO: Implement business logic
    const entity = ${MODULE_NAME_PASCAL}Entity.create({
      id: crypto.randomUUID(),
    });

    return this.repository.save(entity);
  }
}
EOF

# Get By ID Use Case
cat > "$BASE_PATH/application/use-cases/get-$MODULE_NAME_SINGULAR-by-id/get-$MODULE_NAME_SINGULAR-by-id.use-case.ts" << EOF
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { I${MODULE_NAME_PASCAL}Repository } from '../../../domain/repositories/$MODULE_NAME_SINGULAR-repository.interface';
import { ${MODULE_NAME_PASCAL}Entity } from '../../../domain/entities/$MODULE_NAME_SINGULAR.entity';

@Injectable()
export class Get${MODULE_NAME_PASCAL}ByIdUseCase {
  constructor(
    @Inject(I${MODULE_NAME_PASCAL}Repository)
    private readonly repository: I${MODULE_NAME_PASCAL}Repository,
  ) {}

  async execute(id: string): Promise<${MODULE_NAME_PASCAL}Entity> {
    const entity = await this.repository.findById(id);

    if (!entity) {
      throw new NotFoundException('${MODULE_NAME_PASCAL} not found');
    }

    return entity;
  }
}
EOF

# ============= INFRASTRUCTURE LAYER =============

# Schema
cat > "$BASE_PATH/infrastructure/persistence/$MODULE_NAME_SINGULAR.schema.ts" << EOF
import { EntitySchema } from 'typeorm';

export interface ${MODULE_NAME_PASCAL}Schema {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ${MODULE_NAME_PASCAL}Schema = new EntitySchema<${MODULE_NAME_PASCAL}Schema>({
  name: '${MODULE_NAME_PASCAL}',
  tableName: '${MODULE_NAME_LOWER}',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp',
      updateDate: true,
    },
  },
});
EOF

# Repository
cat > "$BASE_PATH/infrastructure/persistence/$MODULE_NAME_SINGULAR.repository.ts" << EOF
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I${MODULE_NAME_PASCAL}Repository } from '../../domain/repositories/$MODULE_NAME_SINGULAR-repository.interface';
import { ${MODULE_NAME_PASCAL}Entity } from '../../domain/entities/$MODULE_NAME_SINGULAR.entity';
import { ${MODULE_NAME_PASCAL}Schema } from './$MODULE_NAME_SINGULAR.schema';
import { ${MODULE_NAME_PASCAL}Mapper } from './$MODULE_NAME_SINGULAR.mapper';

@Injectable()
export class ${MODULE_NAME_PASCAL}Repository implements I${MODULE_NAME_PASCAL}Repository {
  constructor(
    @InjectRepository(${MODULE_NAME_PASCAL}Schema)
    private readonly repository: Repository<${MODULE_NAME_PASCAL}Schema>,
  ) {}

  async findById(id: string): Promise<${MODULE_NAME_PASCAL}Entity | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? ${MODULE_NAME_PASCAL}Mapper.toDomain(schema) : null;
  }

  async save(entity: ${MODULE_NAME_PASCAL}Entity): Promise<${MODULE_NAME_PASCAL}Entity> {
    const schema = ${MODULE_NAME_PASCAL}Mapper.toPersistence(entity);
    const saved = await this.repository.save(schema);
    return ${MODULE_NAME_PASCAL}Mapper.toDomain(saved);
  }

  async update(entity: ${MODULE_NAME_PASCAL}Entity): Promise<${MODULE_NAME_PASCAL}Entity> {
    const schema = ${MODULE_NAME_PASCAL}Mapper.toPersistence(entity);
    const updated = await this.repository.save(schema);
    return ${MODULE_NAME_PASCAL}Mapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
EOF

# Mapper
cat > "$BASE_PATH/infrastructure/persistence/$MODULE_NAME_SINGULAR.mapper.ts" << EOF
import { ${MODULE_NAME_PASCAL}Entity } from '../../domain/entities/$MODULE_NAME_SINGULAR.entity';
import { ${MODULE_NAME_PASCAL}Schema } from './$MODULE_NAME_SINGULAR.schema';

export class ${MODULE_NAME_PASCAL}Mapper {
  static toDomain(schema: ${MODULE_NAME_PASCAL}Schema): ${MODULE_NAME_PASCAL}Entity {
    return ${MODULE_NAME_PASCAL}Entity.reconstitute({
      id: schema.id,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(entity: ${MODULE_NAME_PASCAL}Entity): ${MODULE_NAME_PASCAL}Schema {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
EOF

# ============= PRESENTATION LAYER =============

# Controller
cat > "$BASE_PATH/presentation/controllers/$MODULE_NAME_LOWER.controller.ts" << EOF
import { Controller, Get, Post, Patch, Delete, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { Create${MODULE_NAME_PASCAL}UseCase } from '../../application/use-cases/create-$MODULE_NAME_SINGULAR/create-$MODULE_NAME_SINGULAR.use-case';
import { Get${MODULE_NAME_PASCAL}ByIdUseCase } from '../../application/use-cases/get-$MODULE_NAME_SINGULAR-by-id/get-$MODULE_NAME_SINGULAR-by-id.use-case';
import { Create${MODULE_NAME_PASCAL}RequestDto } from '../dtos/create-$MODULE_NAME_SINGULAR-request.dto';
import { ${MODULE_NAME_PASCAL}ResponseDto } from '../dtos/$MODULE_NAME_SINGULAR-response.dto';
import { ApiResponse } from '@shared/types/responses/api-response.interface';

@Controller('$MODULE_NAME_LOWER')
@ApiTags('${MODULE_NAME_PASCAL}')
export class ${MODULE_NAME_PASCAL}Controller {
  constructor(
    private readonly create${MODULE_NAME_PASCAL}UseCase: Create${MODULE_NAME_PASCAL}UseCase,
    private readonly get${MODULE_NAME_PASCAL}ByIdUseCase: Get${MODULE_NAME_PASCAL}ByIdUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new $MODULE_NAME_SINGULAR' })
  @SwaggerResponse({
    status: HttpStatus.CREATED,
    description: '${MODULE_NAME_PASCAL} created successfully',
    type: ${MODULE_NAME_PASCAL}ResponseDto,
  })
  async create(@Body() dto: Create${MODULE_NAME_PASCAL}RequestDto): Promise<ApiResponse<${MODULE_NAME_PASCAL}ResponseDto>> {
    const entity = await this.create${MODULE_NAME_PASCAL}UseCase.execute(dto);

    return {
      success: true,
      data: ${MODULE_NAME_PASCAL}ResponseDto.fromEntity(entity),
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get $MODULE_NAME_SINGULAR by ID' })
  @SwaggerResponse({ status: HttpStatus.OK, description: '${MODULE_NAME_PASCAL} found', type: ${MODULE_NAME_PASCAL}ResponseDto })
  @SwaggerResponse({ status: HttpStatus.NOT_FOUND, description: '${MODULE_NAME_PASCAL} not found' })
  async getById(@Param('id') id: string): Promise<ApiResponse<${MODULE_NAME_PASCAL}ResponseDto>> {
    const entity = await this.get${MODULE_NAME_PASCAL}ByIdUseCase.execute(id);

    return {
      success: true,
      data: ${MODULE_NAME_PASCAL}ResponseDto.fromEntity(entity),
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
EOF

# DTOs
cat > "$BASE_PATH/presentation/dtos/create-$MODULE_NAME_SINGULAR-request.dto.ts" << EOF
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Create${MODULE_NAME_PASCAL}RequestDto {
  // Add your properties here
  // Example:
  // @ApiProperty({ example: 'Example', description: 'Description' })
  // @IsString()
  // name: string;
}
EOF

cat > "$BASE_PATH/presentation/dtos/$MODULE_NAME_SINGULAR-response.dto.ts" << EOF
import { ApiProperty } from '@nestjs/swagger';
import { ${MODULE_NAME_PASCAL}Entity } from '../../domain/entities/$MODULE_NAME_SINGULAR.entity';

export class ${MODULE_NAME_PASCAL}ResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(entity: ${MODULE_NAME_PASCAL}Entity): ${MODULE_NAME_PASCAL}ResponseDto {
    const dto = new ${MODULE_NAME_PASCAL}ResponseDto();
    dto.id = entity.id;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
EOF

# ============= MODULE FILE =============

cat > "$BASE_PATH/$MODULE_NAME_LOWER.module.ts" << EOF
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Infrastructure
import { ${MODULE_NAME_PASCAL}Schema } from './infrastructure/persistence/$MODULE_NAME_SINGULAR.schema';
import { ${MODULE_NAME_PASCAL}Repository } from './infrastructure/persistence/$MODULE_NAME_SINGULAR.repository';

// Domain
import { I${MODULE_NAME_PASCAL}Repository } from './domain/repositories/$MODULE_NAME_SINGULAR-repository.interface';

// Application
import { Create${MODULE_NAME_PASCAL}UseCase } from './application/use-cases/create-$MODULE_NAME_SINGULAR/create-$MODULE_NAME_SINGULAR.use-case';
import { Get${MODULE_NAME_PASCAL}ByIdUseCase } from './application/use-cases/get-$MODULE_NAME_SINGULAR-by-id/get-$MODULE_NAME_SINGULAR-by-id.use-case';

// Presentation
import { ${MODULE_NAME_PASCAL}Controller } from './presentation/controllers/$MODULE_NAME_LOWER.controller';

@Module({
  imports: [TypeOrmModule.forFeature([${MODULE_NAME_PASCAL}Schema])],
  controllers: [${MODULE_NAME_PASCAL}Controller],
  providers: [
    // Repository
    {
      provide: I${MODULE_NAME_PASCAL}Repository,
      useClass: ${MODULE_NAME_PASCAL}Repository,
    },

    // Use Cases
    Create${MODULE_NAME_PASCAL}UseCase,
    Get${MODULE_NAME_PASCAL}ByIdUseCase,
  ],
  exports: [I${MODULE_NAME_PASCAL}Repository, Get${MODULE_NAME_PASCAL}ByIdUseCase],
})
export class ${MODULE_NAME_PASCAL}Module {}
EOF

echo ""
echo "✅ Módulo $MODULE_NAME_PASCAL gerado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Adicione o módulo ao app.module.ts:"
echo "   import { ${MODULE_NAME_PASCAL}Module } from '@modules/$MODULE_NAME_LOWER/$MODULE_NAME_LOWER.module';"
echo ""
echo "2. Personalize a entidade em:"
echo "   $BASE_PATH/domain/entities/$MODULE_NAME_SINGULAR.entity.ts"
echo ""
echo "3. Atualize o schema em:"
echo "   $BASE_PATH/infrastructure/persistence/$MODULE_NAME_SINGULAR.schema.ts"
echo ""
echo "4. Implemente os DTOs em:"
echo "   $BASE_PATH/presentation/dtos/"
echo ""
echo "5. Gere a migration:"
echo "   npm run migration:generate -- -n Create${MODULE_NAME_PASCAL}Table"
echo ""
