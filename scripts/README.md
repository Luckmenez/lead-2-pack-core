# Gerador de Módulos DDD

Script para gerar automaticamente a estrutura completa de um módulo seguindo Domain-Driven Design (DDD) e Clean Architecture.

## Como Usar

### Opção 1: Via npm script (Recomendado)

```bash
npm run generate:module <nome-do-modulo>
```

**Exemplos:**

```bash
# Gerar módulo de produtos
npm run generate:module products

# Gerar módulo de pedidos
npm run generate:module orders

# Gerar módulo de categorias
npm run generate:module categories
```

### Opção 2: Executar script diretamente

```bash
./scripts/generate-ddd-module.sh <nome-do-modulo>
```

## O Que é Gerado

O script cria a seguinte estrutura completa:

```
src/modules/<nome-do-modulo>/
├── domain/
│   ├── entities/
│   │   └── <nome>.entity.ts           # Entidade de domínio
│   ├── repositories/
│   │   └── <nome>-repository.interface.ts  # Interface do repositório
│   └── value-objects/                  # (pasta vazia para você adicionar)
│
├── application/
│   └── use-cases/
│       ├── create-<nome>/
│       │   ├── create-<nome>.use-case.ts
│       │   └── create-<nome>.dto.ts
│       ├── get-<nome>-by-id/
│       │   └── get-<nome>-by-id.use-case.ts
│       ├── update-<nome>/              # (pasta vazia)
│       └── delete-<nome>/              # (pasta vazia)
│
├── infrastructure/
│   ├── persistence/
│   │   ├── <nome>.schema.ts           # Schema TypeORM
│   │   ├── <nome>.repository.ts       # Implementação do repositório
│   │   └── <nome>.mapper.ts           # Mapper Domain <-> Persistence
│   └── services/                      # (pasta vazia para serviços)
│
├── presentation/
│   ├── controllers/
│   │   └── <nome>.controller.ts       # Controller REST
│   └── dtos/
│       ├── create-<nome>-request.dto.ts
│       └── <nome>-response.dto.ts
│
└── <nome>.module.ts                   # Módulo NestJS
```

## Exemplo Prático

Vamos gerar um módulo de **produtos**:

```bash
npm run generate:module products
```

**Saída:**

```
🚀 Gerando módulo DDD: Products
📁 Caminho: src/modules/products
📂 Criando estrutura de pastas...
📝 Gerando arquivos...

✅ Módulo Products gerado com sucesso!

📋 Próximos passos:
1. Adicione o módulo ao app.module.ts:
   import { ProductsModule } from '@modules/products/products.module';

2. Personalize a entidade em:
   src/modules/products/domain/entities/product.entity.ts

3. Atualize o schema em:
   src/modules/products/infrastructure/persistence/product.schema.ts

4. Implemente os DTOs em:
   src/modules/products/presentation/dtos/

5. Gere a migration:
   npm run migration:generate -- -n CreateProductsTable
```

## Próximos Passos Após Gerar

### 1. Adicionar ao App Module

Edite `src/app.module.ts`:

```typescript
import { ProductsModule } from '@modules/products/products.module';

@Module({
  imports: [
    // ...
    ProductsModule,
  ],
})
export class AppModule {}
```

### 2. Personalizar a Entidade

Edite `src/modules/products/domain/entities/product.entity.ts`:

```typescript
export class ProductEntity {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: {
    id: string;
    name: string;
    price: number;
    description: string;
  }): ProductEntity {
    return new ProductEntity(
      props.id,
      props.name,
      props.price,
      props.description,
      new Date(),
      new Date(),
    );
  }
}
```

### 3. Atualizar o Schema

Edite `src/modules/products/infrastructure/persistence/product.schema.ts`:

```typescript
export interface ProductSchema {
  id: string;
  name: string;
  price: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductSchema = new EntitySchema<ProductSchema>({
  name: 'Product',
  tableName: 'products',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
      length: 255,
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
    },
    description: {
      type: 'text',
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
```

### 4. Implementar DTOs

Edite `src/modules/products/presentation/dtos/create-product-request.dto.ts`:

```typescript
import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductRequestDto {
  @ApiProperty({ example: 'Caixa de Papelão 30x40cm', description: 'Nome do produto' })
  @IsString()
  name: string;

  @ApiProperty({ example: 15.99, description: 'Preço do produto' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'Caixa de papelão resistente...', description: 'Descrição' })
  @IsString()
  description: string;
}
```

### 5. Gerar Migration

```bash
npm run migration:generate -- -n CreateProductsTable
npm run migration:run
```

## Estrutura de Arquivos Gerados

Cada arquivo gerado vem com:

- ✅ Imports corretos
- ✅ Decorators NestJS configurados
- ✅ Injeção de dependências
- ✅ Comentários TODO onde você precisa implementar
- ✅ Padrão de nomenclatura consistente
- ✅ Separação clara de responsabilidades

## Convenções de Nomenclatura

O script segue estas convenções:

| Input        | Entity           | Controller        | Use Case             | DTO                      |
|--------------|------------------|-------------------|----------------------|--------------------------|
| `products`   | `ProductEntity`  | `ProductsController` | `CreateProductUseCase` | `CreateProductRequestDto` |
| `orders`     | `OrderEntity`    | `OrdersController`   | `CreateOrderUseCase`   | `CreateOrderRequestDto`   |
| `categories` | `CategoryEntity` | `CategoriesController` | `CreateCategoryUseCase` | `CreateCategoryRequestDto` |

## Personalizações

Você pode editar o script em `scripts/generate-ddd-module.sh` para:

- Adicionar mais use cases (list, search, etc.)
- Incluir testes automaticamente
- Adicionar validações customizadas
- Gerar value objects específicos

## Troubleshooting

### Erro: "Permission denied"

```bash
chmod +x ./scripts/generate-ddd-module.sh
```

### Erro: "Module already exists"

O script não verifica se o módulo já existe. Exclua a pasta manualmente antes de gerar novamente.

### Erro de compilação após gerar

1. Verifique se adicionou o módulo ao `app.module.ts`
2. Execute `npm run build` para ver erros específicos
3. Implemente as propriedades pendentes nas entidades e schemas

## Comparação com NestJS CLI

| Característica | NestJS CLI | DDD Generator |
|----------------|------------|---------------|
| Estrutura | Flat (arquivo único) | DDD (camadas separadas) |
| Pastas | controllers/, services/ | domain/, application/, infrastructure/, presentation/ |
| Repositórios | Não gera | Gera interface + implementação |
| Entities | Básico | Entity pattern com factory methods |
| Mappers | Não gera | Gera mapper domain <-> persistence |
| Use Cases | Não | Sim (Create, GetById) |
| DTOs | Básico | Request + Response com validações |

## Próximos Passos

Após gerar um módulo:

1. ✅ Personalizar entidade de domínio
2. ✅ Atualizar schema do banco
3. ✅ Implementar DTOs de request
4. ✅ Adicionar validações
5. ✅ Gerar migration
6. ✅ Implementar use cases adicionais
7. ✅ Adicionar testes
8. ✅ Proteger rotas com guards (se necessário)

## Exemplo Completo

Ver o módulo `users` ou `auth` na aplicação para exemplos completos de módulos DDD implementados.
