# Arquitetura do Projeto Lead2Pack

Este documento explica a arquitetura completa do projeto, baseada em **Domain-Driven Design (DDD)** e **Clean Architecture**.

## Índice

- [Visão Geral](#visão-geral)
- [Princípios Fundamentais](#princípios-fundamentais)
- [Estrutura de Camadas](#estrutura-de-camadas)
- [Anatomia de um Módulo](#anatomia-de-um-módulo)
- [Padrões Utilizados](#padrões-utilizados)
- [Fluxo de uma Requisição](#fluxo-de-uma-requisição)
- [Separação de Responsabilidades](#separação-de-responsabilidades)
- [Exemplos Práticos](#exemplos-práticos)
- [Boas Práticas](#boas-práticas)

---

## Visão Geral

O projeto segue uma arquitetura **modular** onde cada módulo representa um **Bounded Context** (contexto delimitado) do domínio.

```
src/
├── core/                    # Infraestrutura global (database, config)
├── shared/                  # Código compartilhado entre módulos
└── modules/                 # Módulos de domínio (bounded contexts)
    ├── users/              # Contexto de Usuários
    ├── auth/               # Contexto de Autenticação
    └── products/           # Contexto de Produtos (exemplo)
```

### Por Que Essa Arquitetura?

✅ **Manutenibilidade**: Código organizado e fácil de entender
✅ **Testabilidade**: Camadas desacopladas facilitam testes
✅ **Escalabilidade**: Novos módulos podem ser adicionados sem afetar existentes
✅ **Separação de Responsabilidades**: Cada camada tem um propósito único
✅ **Independência de Frameworks**: Lógica de negócio não depende de NestJS, TypeORM, etc.

---

## Princípios Fundamentais

### 1. Domain-Driven Design (DDD)

O DDD coloca o **domínio de negócio** no centro da aplicação.

**Conceitos-chave:**
- **Entity**: Objeto com identidade única (ex: User, Product)
- **Value Object**: Objeto sem identidade, definido por seus valores (ex: Email, Password)
- **Repository**: Abstração para acesso a dados
- **Use Case**: Representa uma ação/operação de negócio
- **Bounded Context**: Limite claro entre diferentes contextos do domínio

### 2. Clean Architecture

A Clean Architecture organiza o código em **camadas concêntricas**, onde:
- **Camadas internas** não conhecem camadas externas
- **Dependências** apontam sempre para dentro (em direção ao domínio)

```
┌─────────────────────────────────────┐
│     Presentation (Controllers)      │  ← Camada Externa (UI/API)
├─────────────────────────────────────┤
│   Infrastructure (Persistence)      │  ← Detalhes de Implementação
├─────────────────────────────────────┤
│   Application (Use Cases)           │  ← Orquestração
├─────────────────────────────────────┤
│   Domain (Entities, Value Objects)  │  ← Núcleo (Regras de Negócio)
└─────────────────────────────────────┘
```

### 3. SOLID Principles

- **S**ingle Responsibility: Cada classe tem uma única responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Subtipos devem ser substituíveis
- **I**nterface Segregation: Interfaces específicas são melhores que genéricas
- **D**ependency Inversion: Dependa de abstrações, não de implementações

---

## Estrutura de Camadas

Cada módulo é dividido em **4 camadas principais**:

### 1. Domain Layer (Camada de Domínio) 🎯

**Responsabilidade**: Contém as **regras de negócio** puras, sem dependências externas.

```
domain/
├── entities/               # Entidades do domínio
│   └── user.entity.ts
├── repositories/           # Interfaces de repositórios (abstração)
│   └── user-repository.interface.ts
└── value-objects/          # Objetos de valor
    ├── email.vo.ts
    └── password.vo.ts
```

**Características:**
- ✅ **Zero dependências** de frameworks (NestJS, TypeORM, etc.)
- ✅ Contém **lógica de negócio**
- ✅ Define **contratos** (interfaces) para o mundo externo
- ✅ É o **coração** da aplicação

**Exemplo - Entity:**

```typescript
export class UserEntity {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: Email,      // Value Object
    public readonly password: Password, // Value Object
    public readonly role: UserRole,
  ) {}

  // Factory method - cria nova instância
  static create(props: CreateUserProps): UserEntity {
    // Validações de negócio
    if (props.role === 'SUPPLIER' && !props.companyName) {
      throw new DomainException('Supplier must have a company name');
    }

    return new UserEntity(
      crypto.randomUUID(),
      props.name,
      Email.create(props.email),
      Password.create(props.password),
      props.role,
    );
  }

  // Reconstitui entidade existente (vinda do banco)
  static reconstitute(props: UserProps): UserEntity {
    return new UserEntity(
      props.id,
      props.name,
      props.email,
      props.password,
      props.role,
    );
  }

  // Métodos de negócio
  isSupplier(): boolean {
    return this.role === UserRole.SUPPLIER;
  }

  canManageProducts(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.SUPPLIER;
  }
}
```

**Exemplo - Value Object:**

```typescript
export class Email {
  private constructor(public readonly value: string) {}

  static create(email: string): Email {
    if (!this.isValid(email)) {
      throw new ValidationException('Invalid email format');
    }
    return new Email(email.toLowerCase().trim());
  }

  private static isValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

**Exemplo - Repository Interface:**

```typescript
export abstract class IUserRepository {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: Email): Promise<UserEntity | null>;
  abstract save(user: UserEntity): Promise<UserEntity>;
  abstract update(user: UserEntity): Promise<UserEntity>;
  abstract delete(id: string): Promise<void>;
}
```

---

### 2. Application Layer (Camada de Aplicação) 🎬

**Responsabilidade**: Orquestra as **regras de negócio** através de **Use Cases**.

```
application/
└── use-cases/
    ├── create-user/
    │   ├── create-user.use-case.ts
    │   └── create-user.dto.ts
    ├── get-user-by-id/
    │   └── get-user-by-id.use-case.ts
    └── authenticate-user/
        ├── authenticate-user.use-case.ts
        └── authenticate-user.dto.ts
```

**Características:**
- ✅ **Orquestra** entidades e repositórios
- ✅ **Coordena** transações e fluxos de trabalho
- ✅ **Independente** de detalhes de infraestrutura
- ✅ Cada Use Case = **1 ação de negócio**

**Exemplo - Use Case:**

```typescript
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: BcryptPasswordHasherService,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    // 1. Validar regras de negócio
    const existingUser = await this.userRepository.findByEmail(
      Email.create(dto.email)
    );

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // 2. Criar entidade de domínio
    const user = UserEntity.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role,
      companyName: dto.companyName,
    });

    // 3. Hash da senha (serviço de infraestrutura)
    const hashedPassword = await this.passwordHasher.hash(
      user.password.value
    );

    // 4. Persistir
    return this.userRepository.save(user);
  }
}
```

**Por que Use Cases?**
- Cada caso de uso representa uma **história de usuário**
- Facilita **testes** (testar regra de negócio sem HTTP/DB)
- Permite **reutilização** (mesmo use case em REST, GraphQL, CLI)

---

### 3. Infrastructure Layer (Camada de Infraestrutura) 🔧

**Responsabilidade**: Implementa **detalhes técnicos** (banco de dados, APIs externas, etc.).

```
infrastructure/
├── persistence/
│   ├── user.schema.ts          # Schema TypeORM
│   ├── user.repository.ts      # Implementação do IUserRepository
│   └── user.mapper.ts          # Converte Domain ↔ Persistence
└── services/
    └── bcrypt-password-hasher.service.ts
```

**Características:**
- ✅ **Implementa** interfaces definidas no domínio
- ✅ **Contém** detalhes de frameworks (TypeORM, Axios, etc.)
- ✅ **Isolada** do domínio (pode ser trocada sem afetar negócio)

**Exemplo - Schema (TypeORM):**

```typescript
export interface UserSchema {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  company_name: string | null;
  created_at: Date;
  updated_at: Date;
}

export const UserSchema = new EntitySchema<UserSchema>({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    email: {
      type: 'varchar',
      unique: true,
    },
    // ... outros campos
  },
});
```

**Exemplo - Repository Implementation:**

```typescript
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? UserMapper.toDomain(schema) : null;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const schema = UserMapper.toPersistence(user);
    const saved = await this.repository.save(schema);
    return UserMapper.toDomain(saved);
  }
}
```

**Exemplo - Mapper:**

```typescript
export class UserMapper {
  // Converte Schema (banco) → Entity (domínio)
  static toDomain(schema: UserSchema): UserEntity {
    return UserEntity.reconstitute({
      id: schema.id,
      name: schema.name,
      email: Email.create(schema.email),
      password: Password.reconstitute(schema.password),
      role: schema.role as UserRole,
      companyName: schema.company_name,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at,
    });
  }

  // Converte Entity (domínio) → Schema (banco)
  static toPersistence(entity: UserEntity): UserSchema {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email.value,
      password: entity.password.value,
      role: entity.role,
      company_name: entity.companyName || null,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }
}
```

**Por que Mapper?**
- Separa **modelo de domínio** do **modelo de persistência**
- Permite **evoluir** o banco sem afetar o domínio
- Facilita **migração** de banco de dados

---

### 4. Presentation Layer (Camada de Apresentação) 🌐

**Responsabilidade**: Expõe a aplicação para o **mundo externo** (REST API, GraphQL, etc.).

```
presentation/
├── controllers/
│   └── users.controller.ts
└── dtos/
    ├── create-user-request.dto.ts
    └── user-response.dto.ts
```

**Características:**
- ✅ **Controllers** NestJS
- ✅ **DTOs** de entrada/saída (validação)
- ✅ **Swagger** documentation
- ✅ **Formatação** de respostas

**Exemplo - Controller:**

```typescript
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(
    @Body() dto: CreateUserRequestDto
  ): Promise<ApiResponse<UserResponseDto>> {
    // 1. Delega para o Use Case
    const user = await this.createUserUseCase.execute({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role,
      companyName: dto.companyName,
    });

    // 2. Formata resposta
    return {
      success: true,
      data: UserResponseDto.fromEntity(user),
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.getUserByIdUseCase.execute(id);

    return {
      success: true,
      data: UserResponseDto.fromEntity(user),
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
```

**Exemplo - Request DTO:**

```typescript
export class CreateUserRequestDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'joao@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'CUSTOMER', enum: ['CUSTOMER', 'SUPPLIER', 'ADMIN'] })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'Empresa ABC', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;
}
```

**Exemplo - Response DTO:**

```typescript
export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  companyName: string | null;

  static fromEntity(entity: UserEntity): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.email = entity.email.value;
    dto.role = entity.role;
    dto.companyName = entity.companyName || null;
    return dto;
  }
}
```

---

## Anatomia de um Módulo

### Estrutura Completa

```
src/modules/users/
│
├── domain/                          # ← NÚCLEO (Regras de Negócio)
│   ├── entities/
│   │   └── user.entity.ts          # Entidade User
│   ├── repositories/
│   │   └── user-repository.interface.ts  # Contrato do repositório
│   └── value-objects/
│       ├── email.vo.ts             # Value Object Email
│       └── password.vo.ts          # Value Object Password
│
├── application/                     # ← ORQUESTRAÇÃO
│   └── use-cases/
│       ├── create-user/
│       │   ├── create-user.use-case.ts
│       │   └── create-user.dto.ts
│       └── get-user-by-id/
│           └── get-user-by-id.use-case.ts
│
├── infrastructure/                  # ← DETALHES TÉCNICOS
│   ├── persistence/
│   │   ├── user.schema.ts          # TypeORM Schema
│   │   ├── user.repository.ts      # Implementação do repositório
│   │   └── user.mapper.ts          # Mapper Domain ↔ DB
│   └── services/
│       └── bcrypt-password-hasher.service.ts
│
├── presentation/                    # ← INTERFACE EXTERNA
│   ├── controllers/
│   │   └── users.controller.ts     # REST Controller
│   └── dtos/
│       ├── create-user-request.dto.ts
│       └── user-response.dto.ts
│
└── users.module.ts                  # ← MÓDULO NESTJS
```

### Arquivo de Módulo (users.module.ts)

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema]),
  ],
  controllers: [
    UsersController,
  ],
  providers: [
    // Repository (implementação)
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },

    // Services
    BcryptPasswordHasherService,

    // Use Cases
    CreateUserUseCase,
    GetUserByIdUseCase,
  ],
  exports: [
    IUserRepository,
    GetUserByIdUseCase,
    BcryptPasswordHasherService,
  ],
})
export class UsersModule {}
```

---

## Padrões Utilizados

### 1. Repository Pattern

**Objetivo**: Abstrair acesso a dados.

```typescript
// Interface (Domain)
export abstract class IUserRepository {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract save(user: UserEntity): Promise<UserEntity>;
}

// Implementação (Infrastructure)
@Injectable()
export class UserRepository implements IUserRepository {
  // Implementação com TypeORM
}
```

**Benefícios:**
- ✅ Domínio não conhece TypeORM
- ✅ Fácil trocar banco de dados
- ✅ Fácil mockar em testes

### 2. Factory Pattern

**Objetivo**: Criar entidades com validações.

```typescript
export class UserEntity {
  // Construtor privado
  private constructor(/* ... */) {}

  // Factory method
  static create(props: CreateUserProps): UserEntity {
    // Validações
    return new UserEntity(/* ... */);
  }
}
```

### 3. Mapper Pattern

**Objetivo**: Converter entre camadas.

```typescript
export class UserMapper {
  static toDomain(schema: UserSchema): UserEntity { /* ... */ }
  static toPersistence(entity: UserEntity): UserSchema { /* ... */ }
}
```

### 4. Dependency Injection

**Objetivo**: Inverter dependências.

```typescript
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)  // ← Depende da abstração
    private readonly repo: IUserRepository,
  ) {}
}
```

---

## Fluxo de uma Requisição

Vamos acompanhar o fluxo de uma requisição **POST /users**:

```
1. HTTP Request
   ↓
2. UsersController.create()
   ├─ Valida CreateUserRequestDto (class-validator)
   ├─ Chama CreateUserUseCase
   ↓
3. CreateUserUseCase.execute()
   ├─ Busca email existente (UserRepository)
   ├─ Cria UserEntity (validações de domínio)
   ├─ Hash da senha (BcryptService)
   ├─ Salva no banco (UserRepository)
   ↓
4. UserRepository.save()
   ├─ Converte Entity → Schema (UserMapper)
   ├─ Persiste com TypeORM
   ├─ Converte Schema → Entity (UserMapper)
   ↓
5. UsersController
   ├─ Converte Entity → UserResponseDto
   ├─ Formata ApiResponse
   ↓
6. HTTP Response (JSON)
```

**Diagrama de Sequência:**

```
Client → Controller → UseCase → Repository → Database
   ↓         ↓          ↓           ↓
  HTTP     DTO      Entity       Schema
```

---

## Separação de Responsabilidades

### Onde Colocar Cada Tipo de Código?

| O Que | Onde Colocar | Exemplo |
|-------|--------------|---------|
| Validação de formato | Value Object | Email válido? |
| Regra de negócio | Entity | Supplier precisa de company? |
| Orquestração | Use Case | Criar user + enviar email |
| Acesso a dados | Repository | Buscar user por email |
| Conversão de dados | Mapper | Entity ↔ Schema |
| Validação de entrada | Request DTO | @IsEmail(), @MinLength() |
| Formatação de saída | Response DTO | Esconder password |
| Endpoints HTTP | Controller | POST /users |
| Configuração | Module | Dependency injection |

### Regra de Ouro

**"Se você não sabe onde colocar, pergunte: isso é uma regra de negócio ou um detalhe técnico?"**

- **Regra de negócio** → Domain/Application
- **Detalhe técnico** → Infrastructure/Presentation

---

## Exemplos Práticos

### Exemplo 1: Criar um Novo Produto

**1. Entity (domain/entities/product.entity.ts)**

```typescript
export class ProductEntity {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly supplierId: string,
  ) {}

  static create(props: {
    name: string;
    price: number;
    supplierId: string;
  }): ProductEntity {
    if (props.price <= 0) {
      throw new DomainException('Price must be positive');
    }

    return new ProductEntity(
      crypto.randomUUID(),
      props.name,
      props.price,
      props.supplierId,
    );
  }
}
```

**2. Use Case (application/use-cases/create-product/)**

```typescript
@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepo: IProductRepository,
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<ProductEntity> {
    // Validar se supplier existe
    const supplier = await this.userRepo.findById(dto.supplierId);
    if (!supplier || !supplier.isSupplier()) {
      throw new BadRequestException('Invalid supplier');
    }

    // Criar produto
    const product = ProductEntity.create({
      name: dto.name,
      price: dto.price,
      supplierId: dto.supplierId,
    });

    return this.productRepo.save(product);
  }
}
```

**3. Controller (presentation/controllers/products.controller.ts)**

```typescript
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  @Post()
  @Roles('SUPPLIER', 'ADMIN')
  async create(
    @CurrentUser() user: any,
    @Body() dto: CreateProductRequestDto,
  ) {
    const product = await this.createProductUseCase.execute({
      ...dto,
      supplierId: user.id,
    });

    return {
      success: true,
      data: ProductResponseDto.fromEntity(product),
    };
  }
}
```

### Exemplo 2: Separar Auth de Users

Este projeto separa **Autenticação** (Auth) de **Usuários** (Users):

**UsersModule**:
- Gestão de usuários (CRUD)
- Entidade User
- Repository

**AuthModule**:
- Login/Logout
- Geração de tokens JWT
- Guards (proteção de rotas)
- Strategies (Passport)

**Por quê?**
- **Single Responsibility**: Cada módulo tem um propósito
- **Reutilização**: Auth pode autenticar outros tipos além de User
- **Testabilidade**: Testar auth independente de users

Ver [análise completa](woolly-tickling-toast.md).

---

## Boas Práticas

### 1. Naming Conventions

```typescript
// Entities
UserEntity, ProductEntity

// Value Objects
Email, Password, Money

// Use Cases
CreateUserUseCase, GetUserByIdUseCase

// Repositories
IUserRepository (interface)
UserRepository (implementação)

// DTOs
CreateUserRequestDto, UserResponseDto

// Controllers
UsersController, ProductsController
```

### 2. Evite Anemia de Domínio

❌ **Ruim** (Domain Anêmico):
```typescript
class UserEntity {
  public name: string;
  public email: string;
  // Apenas getters/setters, sem lógica
}
```

✅ **Bom** (Domain Rico):
```typescript
class UserEntity {
  private constructor(/* ... */) {}

  static create(props: CreateProps): UserEntity {
    // Validações aqui
  }

  canManageProducts(): boolean {
    return this.role === 'ADMIN' || this.role === 'SUPPLIER';
  }
}
```

### 3. Use Value Objects

❌ **Ruim**:
```typescript
class UserEntity {
  email: string; // String simples
}
```

✅ **Bom**:
```typescript
class UserEntity {
  email: Email; // Value Object com validações
}

class Email {
  static create(value: string): Email {
    if (!isValid(value)) throw new Error();
    return new Email(value);
  }
}
```

### 4. Mantenha Use Cases Simples

❌ **Ruim** (Use Case fazendo tudo):
```typescript
class CreateUserUseCase {
  async execute(dto: CreateUserDto) {
    // Validar email (deveria estar no VO)
    if (!dto.email.includes('@')) throw new Error();

    // Lógica de negócio (deveria estar na Entity)
    if (dto.role === 'SUPPLIER' && !dto.company) throw new Error();

    // Salvar no banco
    await this.repo.save(user);
  }
}
```

✅ **Bom** (Use Case orquestrando):
```typescript
class CreateUserUseCase {
  async execute(dto: CreateUserDto) {
    // Entity faz validações
    const user = UserEntity.create(dto);

    // Repository persiste
    return this.repo.save(user);
  }
}
```

### 5. Teste Cada Camada Isoladamente

```typescript
// Testar Entity (sem dependências)
describe('UserEntity', () => {
  it('should not allow supplier without company', () => {
    expect(() => UserEntity.create({
      role: 'SUPPLIER',
      companyName: null,
    })).toThrow();
  });
});

// Testar Use Case (com mock)
describe('CreateUserUseCase', () => {
  it('should throw if email exists', async () => {
    const mockRepo = { findByEmail: jest.fn(() => existingUser) };
    const useCase = new CreateUserUseCase(mockRepo);

    await expect(useCase.execute(dto)).rejects.toThrow();
  });
});
```

---

## Recursos Adicionais

- **[AUTH_USAGE_EXAMPLES.md](AUTH_USAGE_EXAMPLES.md)** - Como usar Auth Guards e Decorators
- **[scripts/README.md](scripts/README.md)** - Gerador de módulos DDD
- **[Análise Auth vs Users](/.claude/plans/woolly-tickling-toast.md)** - Por que separar

---

## Conclusão

Esta arquitetura pode parecer **complexa** no início, mas traz **enormes benefícios**:

✅ **Código organizado** e fácil de navegar
✅ **Regras de negócio** protegidas e testáveis
✅ **Fácil manutenção** e evolução
✅ **Independente** de frameworks
✅ **Escalável** para projetos grandes

**Lembre-se**: O objetivo não é seguir regras cegamente, mas **facilitar o desenvolvimento** e **reduzir bugs**.

---

**Dúvidas?** Consulte os módulos existentes (`users`, `auth`) como referência!
