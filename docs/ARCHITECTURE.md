# Arquitetura do Projeto Lead2Pack

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Princípios Arquiteturais](#princípios-arquiteturais)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Módulos do Sistema](#módulos-do-sistema)
5. [Camadas da Aplicação](#camadas-da-aplicação)
6. [Fluxo de Dados](#fluxo-de-dados)
7. [Padrões e Convenções](#padrões-e-convenções)

---

## 🎯 Visão Geral

O Lead2Pack é uma aplicação NestJS construída seguindo os princípios de **Clean Architecture** (Arquitetura Limpa) e **Domain-Driven Design (DDD)**. A aplicação separa conceitos de domínio de negócio (users, sectors) de conceitos técnicos/operacionais (collaborators).

### Objetivo da Arquitetura

- **Separação de responsabilidades**: Cada camada tem um propósito claro
- **Independência de frameworks**: A lógica de negócio não depende do NestJS
- **Testabilidade**: Cada camada pode ser testada isoladamente
- **Manutenibilidade**: Código organizado e fácil de entender
- **Escalabilidade**: Fácil adicionar novos módulos e funcionalidades

---

## 🏛️ Princípios Arquiteturais

### 1. Clean Architecture (Arquitetura Limpa)

A aplicação é dividida em camadas concêntricas, onde as camadas internas não conhecem as externas:

```
┌─────────────────────────────────────────────┐
│         Presentation (Controllers)          │  ← Interface com o mundo externo
├─────────────────────────────────────────────┤
│         Application (Use Cases)             │  ← Casos de uso da aplicação
├─────────────────────────────────────────────┤
│         Domain (Entities, VOs, Rules)       │  ← Regras de negócio puras
├─────────────────────────────────────────────┤
│    Infrastructure (DB, External Services)   │  ← Detalhes de implementação
└─────────────────────────────────────────────┘
```

**Regra de Dependência**: As dependências apontam sempre para dentro (camadas externas dependem das internas, nunca o contrário).

### 2. Domain-Driven Design (DDD)

- **Bounded Contexts**: Cada módulo representa um contexto delimitado
- **Entities**: Objetos com identidade única (User, Collaborator, Sector)
- **Value Objects**: Objetos sem identidade, definidos por seus atributos (Email, Password)
- **Repositories**: Abstrações para persistência de dados
- **Use Cases**: Ações que o sistema pode realizar

### 3. Dependency Inversion Principle (DIP)

- Interfaces (contratos) definidas nas camadas internas
- Implementações concretas nas camadas externas
- Injeção de dependências via NestJS

---

## 📁 Estrutura de Pastas

```
src/
├── core/                    # Núcleo da aplicação (configurações globais)
│   ├── database/           # Configuração do banco de dados
│   └── config/             # Configurações gerais
│
├── modules/                # Módulos de domínio (bounded contexts)
│   ├── users/             # Contexto de Usuários de Negócio
│   ├── collaborators/     # Contexto de Gestores do Sistema
│   ├── auth/              # Contexto de Autenticação
│   └── sectors/           # Contexto de Setores
│
├── shared/                 # Código compartilhado entre módulos
│   ├── domain/            # Abstrações e classes base do domínio
│   ├── types/             # Tipos TypeScript compartilhados
│   ├── validators/        # Validadores reutilizáveis
│   └── pipes/             # Pipes customizados do NestJS
│
├── app.module.ts          # Módulo raiz da aplicação
└── main.ts                # Ponto de entrada da aplicação
```

---

## 🧩 Módulos do Sistema

### 1. **Core** (`src/core/`)

**Propósito**: Configurações e funcionalidades fundamentais da aplicação.

#### `core/database/`

**O que faz**: Gerencia toda a configuração e interação com o banco de dados PostgreSQL.

```
core/database/
├── typeorm.config.ts       # Configuração do TypeORM (conexão, migrations)
├── database.module.ts      # Módulo NestJS para injeção do TypeORM
└── migrations/             # Histórico de alterações no banco
    ├── 1766367630608-CreateUsersTable.ts
    ├── 1735358888000-UpdateUsersForPersonas.ts
    ├── 1735359000000-RefineUsersToJsonbPure.ts
    ├── 1735360000000-CreateCollaboratorsTable.ts
    └── 1735361000000-UpdateUsersRoleEnum.ts
```

**Arquivos principais**:

- **`typeorm.config.ts`**: Define conexão com PostgreSQL, localização de entities e migrations
- **`migrations/`**: Versionamento do schema do banco (criação de tabelas, alteração de colunas, etc.)

**Por que existe**: Centralizar toda configuração de banco em um único lugar, facilitar migrations e manter histórico de mudanças.

---

### 2. **Users** (`src/modules/users/`)

**Propósito**: Gerenciar usuários de negócio (CUSTOMER, SUPPLIER, SECTOR_PROFESSIONAL).

```
modules/users/
├── domain/                        # Camada de Domínio (regras de negócio)
│   ├── entities/
│   │   └── user.entity.ts        # Entity User com regras de negócio
│   ├── repositories/
│   │   └── user-repository.interface.ts  # Contrato do repositório
│   └── value-objects/
│       └── password.vo.ts        # Value Object para senha
│
├── application/                   # Camada de Aplicação (casos de uso)
│   └── use-cases/
│       ├── create-user/
│       │   ├── create-user.dto.ts
│       │   └── create-user.use-case.ts
│       ├── get-user-by-id/
│       │   └── get-user-by-id.use-case.ts
│       └── update-user/
│           └── update-user.use-case.ts
│
├── infrastructure/                # Camada de Infraestrutura (implementações)
│   ├── persistence/
│   │   ├── user.schema.ts        # Schema TypeORM (tabela users)
│   │   ├── user.mapper.ts        # Converte Entity ↔ Schema
│   │   └── user.repository.ts    # Implementação do repositório
│   └── services/
│       └── bcrypt-password-hasher.service.ts  # Hash de senhas
│
├── presentation/                  # Camada de Apresentação (API REST)
│   ├── controllers/
│   │   └── users.controller.ts   # Endpoints HTTP (/users)
│   ├── dtos/
│   │   ├── create-user-request.dto.ts
│   │   └── user-response.dto.ts
│   ├── mappers/
│   │   └── user-response.mapper.ts  # Entity → DTO de resposta
│   └── docs/
│       └── doc-interfaces/
│           └── user-response.doc.ts  # Documentação Swagger
│
└── users.module.ts                # Módulo NestJS (registra tudo)
```

#### **Camada Domain** (`domain/`)

**O que faz**: Contém as regras de negócio puras, sem dependências externas.

##### `domain/entities/user.entity.ts`

**Responsabilidade**:
- Representar um usuário de negócio com identidade única
- Validar regras de negócio (email válido, senha forte, profileData obrigatório)
- Encapsular comportamentos (updateEmail, updatePassword, updateProfileData)

**Exemplo de regra**:
```typescript
// ✅ Todos os users DEVEM ter profileData
if (!this._profileData) {
  throw new ValidationException('User profileData cannot be empty');
}
```

**Por que é importante**: A entity é o coração do domínio. Ela garante que dados inválidos nunca entrem no sistema.

##### `domain/repositories/user-repository.interface.ts`

**Responsabilidade**:
- Definir contrato (interface) para operações de persistência
- **NÃO** implementa nada, apenas define métodos

**Exemplo**:
```typescript
export interface IUserRepository {
  save(user: UserEntity): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
}
```

**Por que é importante**: Permite trocar a implementação (PostgreSQL → MongoDB) sem alterar a lógica de negócio. Princípio da Inversão de Dependência.

##### `domain/value-objects/password.vo.ts`

**Responsabilidade**:
- Representar uma senha com validações
- Garantir que senhas fracas não sejam aceitas

**Por que Value Object**: Senha não tem identidade própria, é apenas um valor que pertence ao User.

---

#### **Camada Application** (`application/`)

**O que faz**: Orquestra as regras de negócio para realizar casos de uso específicos.

##### `application/use-cases/create-user/create-user.use-case.ts`

**Responsabilidade**:
1. Validar se email já existe
2. Criar hash da senha
3. Criar entity User
4. Salvar no repositório

**Exemplo**:
```typescript
async execute(dto: CreateUserDto): Promise<UserEntity> {
  // 1. Validar email único
  const emailExists = await this.userRepository.existsByEmail(dto.email);
  if (emailExists) {
    throw new ConflictException('Email already registered');
  }

  // 2. Hash da senha
  const hashedPassword = await this.passwordHasher.hash(dto.password);

  // 3. Criar entity
  const user = UserEntity.create({ ...dto, password: hashedPassword });

  // 4. Salvar
  return await this.userRepository.save(user);
}
```

**Por que existe**: Separar a orquestração (use case) da regra de negócio pura (entity). Use cases podem mudar, entities não.

---

#### **Camada Infrastructure** (`infrastructure/`)

**O que faz**: Implementa detalhes técnicos (banco de dados, serviços externos).

##### `infrastructure/persistence/user.schema.ts`

**Responsabilidade**:
- Definir estrutura da tabela `users` no PostgreSQL
- Decorators do TypeORM (@Entity, @Column, etc.)

**Exemplo**:
```typescript
@Entity('users')
export class UserSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'jsonb' })
  profile_data: Record<string, any>;
}
```

**Por que existe**: TypeORM precisa saber como mapear objetos TypeScript para tabelas SQL.

##### `infrastructure/persistence/user.mapper.ts`

**Responsabilidade**:
- Converter `UserEntity` (domínio) ↔ `UserSchema` (banco)

**Exemplo**:
```typescript
// Banco → Domínio
static toDomain(schema: UserSchema): UserEntity {
  return UserEntity.reconstitute({
    id: schema.id,
    email: Email.create(schema.email),
    password: Password.fromHash(schema.password),
    role: schema.role,
    profileData: schema.profile_data,
  });
}

// Domínio → Banco
static toPersistence(entity: UserEntity): Partial<UserSchema> {
  return {
    id: entity.id,
    email: entity.email.value,
    password: entity.password.value,
    role: entity.role,
    profile_data: entity.profileData,
  };
}
```

**Por que existe**: Isolar o domínio do banco de dados. Se mudar o banco, só muda o mapper.

##### `infrastructure/persistence/user.repository.ts`

**Responsabilidade**:
- Implementar `IUserRepository`
- Usar TypeORM para operações CRUD

**Exemplo**:
```typescript
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const schema = UserMapper.toPersistence(user);
    const saved = await this.repository.save(schema);
    return UserMapper.toDomain(saved);
  }
}
```

**Por que existe**: Implementação concreta da interface definida no domínio.

---

#### **Camada Presentation** (`presentation/`)

**O que faz**: Expõe a API REST (HTTP) para o mundo externo.

##### `presentation/controllers/users.controller.ts`

**Responsabilidade**:
- Receber requisições HTTP
- Chamar use cases
- Retornar respostas HTTP

**Exemplo**:
```typescript
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserRequestDto) {
    const user = await this.createUserUseCase.execute(dto);
    return UserResponseMapper.toResponse(user);
  }
}
```

**Por que existe**: Isolar detalhes HTTP (status codes, headers) da lógica de negócio.

##### `presentation/dtos/create-user-request.dto.ts`

**Responsabilidade**:
- Validar dados de entrada da API
- Usar decorators do `class-validator`

**Exemplo**:
```typescript
export class CreateUserRequestDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsObject()
  profileData: Record<string, any>;
}
```

**Por que existe**: Validar dados antes de chegar aos use cases. Falhar rápido.

---

### 3. **Collaborators** (`src/modules/collaborators/`)

**Propósito**: Gerenciar gestores do sistema (ADMIN, SUPPORT, MODERATOR).

**Estrutura**: Idêntica ao módulo Users (Domain → Application → Infrastructure → Presentation).

**Diferenças principais**:
- **Não tem profileData**: Collaborators têm apenas `name`, `role`, `isActive`
- **Autenticação separada**: Rota `/admin/auth/login`
- **JWT diferenciado**: Payload contém `type: 'collaborator'`

**Por que existe**: Separar usuários de negócio (customers, suppliers) de usuários técnicos (admins). Permite evolução independente.

---

### 4. **Auth** (`src/modules/auth/`)

**Propósito**: Gerenciar autenticação e autorização de usuários de negócio.

```
modules/auth/
├── domain/
│   └── interfaces/
│       └── jwt-payload.interface.ts   # Estrutura do token JWT
│
├── application/
│   └── use-cases/
│       ├── login/
│       │   └── login.use-case.ts      # Autenticar usuário
│       └── register/
│           └── register.use-case.ts   # Registrar novo usuário
│
├── infrastructure/
│   └── strategies/
│       └── jwt.strategy.ts            # Validação de token JWT
│
├── presentation/
│   ├── controllers/
│   │   └── auth.controller.ts         # /auth/login, /auth/register
│   ├── decorators/
│   │   ├── current-user.decorator.ts  # @CurrentUser()
│   │   └── public.decorator.ts        # @Public()
│   └── dtos/
│       ├── login-request.dto.ts
│       └── auth-response.dto.ts
│
└── auth.module.ts
```

#### **Componentes principais**:

##### `infrastructure/strategies/jwt.strategy.ts`

**Responsabilidade**:
- Validar token JWT recebido no header `Authorization: Bearer <token>`
- Buscar usuário no banco
- Retornar dados do usuário autenticado

**Exemplo**:
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  async validate(payload: JwtPayload) {
    const user = await this.getUserByIdUseCase.execute(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email.value,
      role: user.role,
    };
  }
}
```

**Por que existe**: Passport.js exige uma strategy para validar tokens.

##### `presentation/decorators/current-user.decorator.ts`

**Responsabilidade**:
- Extrair dados do usuário autenticado da request

**Exemplo de uso**:
```typescript
@Get('profile')
async getProfile(@CurrentUser() user: { id: string; email: string }) {
  return user;
}
```

**Por que existe**: Evitar acessar `request.user` diretamente (mais limpo e type-safe).

---

### 5. **Sectors** (`src/modules/sectors/`)

**Propósito**: Gerenciar setores de atuação (construção civil, elétrica, hidráulica, etc.).

**Estrutura**: Segue o mesmo padrão DDD dos outros módulos.

**Por que existe**: Sector é um conceito de negócio que precisa ser gerenciado separadamente.

---

## 🔄 Fluxo de Dados

### Exemplo: Criar um usuário via API

```
1. HTTP Request
   │
   ├─→ POST /users
   │   Body: { email, password, role, profileData }
   │
2. Presentation Layer (users.controller.ts)
   │
   ├─→ Validação automática (CreateUserRequestDto)
   │   ✅ Email válido? Senha tem 8+ caracteres? Role é enum válido?
   │
3. Application Layer (create-user.use-case.ts)
   │
   ├─→ Email já existe? (consulta repositório)
   ├─→ Hash da senha (BcryptPasswordHasherService)
   ├─→ Criar UserEntity (Domain)
   │   └─→ Validações do domínio executadas
   │
4. Domain Layer (user.entity.ts)
   │
   ├─→ Validar email (Value Object)
   ├─→ Validar profileData obrigatório
   ├─→ Validar role
   │
5. Infrastructure Layer (user.repository.ts)
   │
   ├─→ Converter Entity → Schema (Mapper)
   ├─→ Salvar no PostgreSQL (TypeORM)
   ├─→ Converter Schema → Entity (Mapper)
   │
6. Presentation Layer (response)
   │
   ├─→ Converter Entity → DTO (UserResponseMapper)
   └─→ HTTP Response 201 Created
       Body: { id, email, role, profileData, createdAt, updatedAt }
```

---

## 🔐 Shared (`src/shared/`)

**Propósito**: Código reutilizável entre módulos.

```
shared/
├── domain/                    # Abstrações de domínio
│   ├── base-entity.ts        # Classe base para todas entities
│   ├── exceptions/           # Exceções customizadas
│   │   ├── domain.exception.ts
│   │   └── validation.exception.ts
│   └── value-objects/        # Value Objects compartilhados
│       ├── email.vo.ts       # Email com validação
│       ├── cpf.vo.ts         # CPF brasileiro
│       └── cnpj.vo.ts        # CNPJ brasileiro
│
├── types/                     # Tipos TypeScript
│   ├── enums/
│   │   ├── user-role.enum.ts
│   │   └── collaborator-role.enum.ts
│   └── interfaces/
│       └── profile-data.interface.ts
│
├── validators/                # Validadores reutilizáveis
│   └── profile-data/
│       ├── customer-profile.dto.ts
│       ├── supplier-profile.dto.ts
│       └── sector-professional-profile.dto.ts
│
└── pipes/                     # Pipes customizados NestJS
    └── validate-profile-data.pipe.ts
```

### **Componentes principais**:

#### `shared/domain/base-entity.ts`

**Responsabilidade**:
- Classe base para todas entities
- Fornece `id` e método `equals()`

**Exemplo**:
```typescript
export abstract class BaseEntity {
  protected readonly _id: string;

  constructor(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  equals(entity: BaseEntity): boolean {
    return this._id === entity._id;
  }
}
```

**Por que existe**: Evitar duplicação de código. Todas entities têm ID.

#### `shared/domain/value-objects/email.vo.ts`

**Responsabilidade**:
- Validar formato de email
- Encapsular lógica de email

**Exemplo**:
```typescript
export class Email {
  private constructor(private readonly _value: string) {
    this.validate();
  }

  static create(value: string): Email {
    return new Email(value);
  }

  private validate(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this._value)) {
      throw new ValidationException('Invalid email format');
    }
  }

  get value(): string {
    return this._value;
  }
}
```

**Por que existe**: Email é usado em User e Collaborator. Centralizar validação.

#### `shared/pipes/validate-profile-data.pipe.ts`

**Responsabilidade**:
- Validar profileData baseado no role do usuário
- Cada role tem estrutura diferente de profileData

**Exemplo**:
```typescript
@Injectable()
export class ValidateProfileDataPipe implements PipeTransform {
  private readonly profileDataDtoMap: Record<UserRole, any> = {
    [UserRole.CUSTOMER]: CustomerProfileDataDto,
    [UserRole.SUPPLIER]: SupplierProfileDataDto,
    [UserRole.SECTOR_PROFESSIONAL]: SectorProfessionalProfileDataDto,
  };

  async transform(value: any) {
    const { role, profileData } = value;
    const dtoClass = this.profileDataDtoMap[role];

    // Valida profileData usando o DTO específico do role
    const dtoInstance = plainToInstance(dtoClass, profileData);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new BadRequestException('Profile data validation failed');
    }

    return value;
  }
}
```

**Por que existe**: Validação complexa específica do domínio, reutilizada em múltiplos endpoints.

---

## 🎨 Padrões e Convenções

### 1. **Naming Conventions**

#### Arquivos
- **Entities**: `*.entity.ts` (ex: `user.entity.ts`)
- **DTOs**: `*.dto.ts` (ex: `create-user.dto.ts`)
- **Use Cases**: `*.use-case.ts` (ex: `login.use-case.ts`)
- **Controllers**: `*.controller.ts` (ex: `users.controller.ts`)
- **Repositories**: `*.repository.ts` (ex: `user.repository.ts`)
- **Schemas**: `*.schema.ts` (ex: `user.schema.ts`)
- **Mappers**: `*.mapper.ts` (ex: `user.mapper.ts`)

#### Classes
- **Entities**: `UserEntity`, `CollaboratorEntity`
- **Value Objects**: `Email`, `Password`, `CPF` (sem sufixo)
- **DTOs**: `CreateUserDto`, `LoginRequestDto`
- **Use Cases**: `CreateUserUseCase`, `LoginUseCase`
- **Repositories**: `UserRepository`, `CollaboratorRepository`

### 2. **Dependency Injection**

Todas as dependências são injetadas via constructor:

```typescript
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: BcryptPasswordHasherService,
  ) {}
}
```

### 3. **Error Handling**

#### Camada Domain
Lança exceções específicas:
```typescript
throw new ValidationException('Email is required');
throw new DomainException('Cannot delete active user');
```

#### Camada Application/Presentation
Lança exceções do NestJS:
```typescript
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Invalid credentials');
throw new ConflictException('Email already exists');
```

### 4. **Testes**

Estrutura esperada (ainda não implementada):
```
src/modules/users/
├── domain/
│   └── entities/
│       ├── user.entity.ts
│       └── user.entity.spec.ts      # Testes unitários da entity
├── application/
│   └── use-cases/
│       └── create-user/
│           ├── create-user.use-case.ts
│           └── create-user.use-case.spec.ts  # Testes do use case
└── presentation/
    └── controllers/
        ├── users.controller.ts
        └── users.controller.spec.ts  # Testes de integração
```

---

## 🔑 Conceitos-Chave

### 1. **Entity vs Value Object**

#### Entity
- Tem identidade única (ID)
- Dois users com mesmo email são diferentes se IDs diferentes
- Mutável (pode ter métodos `update*`)

**Exemplo**: `UserEntity`, `CollaboratorEntity`

#### Value Object
- Sem identidade, definido por seus atributos
- Dois emails "test@example.com" são iguais
- Imutável (não tem setters)

**Exemplo**: `Email`, `Password`, `CPF`

### 2. **Repository Pattern**

**Interface** (Domain):
```typescript
export interface IUserRepository {
  save(user: UserEntity): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
}
```

**Implementação** (Infrastructure):
```typescript
@Injectable()
export class UserRepository implements IUserRepository {
  // Usa TypeORM, mas poderia usar qualquer ORM
}
```

**Benefício**: Trocar implementação sem quebrar código.

### 3. **Use Case Pattern**

Cada ação do sistema é um use case:
- `CreateUserUseCase`
- `LoginUseCase`
- `UpdateUserUseCase`
- `DeleteUserUseCase`

**Benefícios**:
- Código organizado por funcionalidade
- Fácil testar isoladamente
- Fácil adicionar novos casos de uso

### 4. **Mapper Pattern**

Converte entre diferentes representações do mesmo conceito:

```typescript
// Entity (domínio) → Schema (banco)
UserMapper.toPersistence(userEntity)

// Schema (banco) → Entity (domínio)
UserMapper.toDomain(userSchema)

// Entity (domínio) → DTO (API)
UserResponseMapper.toResponse(userEntity)
```

**Benefício**: Isolar camadas. Mudar banco não afeta API.

---

## 🚀 Como Adicionar um Novo Módulo

### Passo a Passo: Criar módulo "Products"

1. **Criar estrutura de pastas**:
```bash
mkdir -p src/modules/products/{domain/{entities,repositories},application/use-cases,infrastructure/persistence,presentation/{controllers,dtos}}
```

2. **Domain Layer**:
```typescript
// domain/entities/product.entity.ts
export class ProductEntity extends BaseEntity {
  private _name: string;
  private _price: number;

  // Validações e regras de negócio
}

// domain/repositories/product-repository.interface.ts
export interface IProductRepository {
  save(product: ProductEntity): Promise<ProductEntity>;
  findById(id: string): Promise<ProductEntity | null>;
}
```

3. **Infrastructure Layer**:
```typescript
// infrastructure/persistence/product.schema.ts
@Entity('products')
export class ProductSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;
}

// infrastructure/persistence/product.repository.ts
@Injectable()
export class ProductRepository implements IProductRepository {
  // Implementação usando TypeORM
}
```

4. **Application Layer**:
```typescript
// application/use-cases/create-product/create-product.use-case.ts
@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<ProductEntity> {
    const product = ProductEntity.create(dto);
    return await this.productRepository.save(product);
  }
}
```

5. **Presentation Layer**:
```typescript
// presentation/controllers/products.controller.ts
@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductRequestDto) {
    const product = await this.createProductUseCase.execute(dto);
    return ProductResponseMapper.toResponse(product);
  }
}
```

6. **Module**:
```typescript
// products.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([ProductSchema])],
  controllers: [ProductsController],
  providers: [
    { provide: IProductRepository, useClass: ProductRepository },
    CreateProductUseCase,
  ],
  exports: [],
})
export class ProductsModule {}
```

7. **Registrar em AppModule**:
```typescript
// app.module.ts
@Module({
  imports: [
    // ...
    ProductsModule,
  ],
})
export class AppModule {}
```

---

## 📊 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         HTTP Request                         │
│                    (POST /users, GET /auth)                  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Controllers  │  │     DTOs     │  │   Mappers    │      │
│  │   (HTTP)     │  │ (Validation) │  │ (Entity→DTO) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────┐       │
│  │              Use Cases                            │       │
│  │  (CreateUser, Login, UpdateUser, etc.)           │       │
│  └──────────────────────────────────────────────────┘       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Entities   │  │Value Objects │  │ Repositories │       │
│  │   (User)    │  │ (Email, CPF) │  │ (Interface)  │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Repositories│  │   Schemas    │  │   Mappers    │       │
│  │  (TypeORM)  │  │  (Database)  │  │(Entity↔Schema)│       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  PostgreSQL   │
                    └───────────────┘
```

---

## 🎯 Benefícios desta Arquitetura

### 1. **Separação de Responsabilidades**
Cada camada tem um propósito claro. Controller não conhece banco de dados. Entity não conhece HTTP.

### 2. **Testabilidade**
Pode testar cada camada isoladamente:
- Domain: Testa regras de negócio sem banco
- Application: Testa use cases com repositório mockado
- Presentation: Testa endpoints com use cases mockados

### 3. **Manutenibilidade**
Mudanças em uma camada não afetam outras:
- Trocar PostgreSQL → MongoDB: só muda Infrastructure
- Trocar REST → GraphQL: só muda Presentation
- Adicionar regra de negócio: só muda Domain

### 4. **Escalabilidade**
Fácil adicionar novos módulos seguindo o mesmo padrão.

### 5. **Clareza**
Desenvolvedor novo entende rapidamente onde cada coisa fica.

---

## 📝 Checklist para Revisar Código

Ao revisar um pull request, verificar:

- [ ] Entity tem validações no construtor?
- [ ] Repository usa interface (não implementação concreta)?
- [ ] Use case depende de abstração (não implementação)?
- [ ] Controller apenas chama use case (sem lógica de negócio)?
- [ ] DTO tem validações (@IsEmail, @MinLength, etc.)?
- [ ] Mapper converte corretamente entre camadas?
- [ ] Exceptions apropriadas para cada camada?
- [ ] Naming conventions seguidas?
- [ ] Código está na camada correta?

---

## 🔮 Próximos Passos

### Melhorias Sugeridas

1. **Adicionar testes**:
   - Unitários (entities, value objects)
   - Integração (use cases)
   - E2E (endpoints completos)

2. **Adicionar eventos de domínio**:
   - `UserCreatedEvent`
   - `UserEmailChangedEvent`
   - Event handlers assíncronos

3. **Melhorar validações**:
   - Custom validators para CPF/CNPJ
   - Validações cross-field (senha != email)

4. **Adicionar logging estruturado**:
   - Winston ou Pino
   - Logs em JSON para agregação

5. **Adicionar métricas**:
   - Prometheus
   - Tempo de resposta dos use cases
   - Taxa de erro

6. **Documentação automática**:
   - Swagger completo
   - Exemplos de request/response
   - Schemas de validação

---

## 📚 Referências

### Livros
- **Clean Architecture** - Robert C. Martin (Uncle Bob)
- **Domain-Driven Design** - Eric Evans
- **Implementing Domain-Driven Design** - Vaughn Vernon

### Artigos
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Clean Architecture in Node.js](https://dev.to/bespoyasov/clean-architecture-on-frontend-4311)

### Repositórios de Exemplo
- [NestJS Clean Architecture](https://github.com/pvarentsov/typescript-clean-architecture)
- [Node.js DDD Example](https://github.com/stemmlerjs/ddd-forum)

---

## 💡 Glossário

| Termo | Definição |
|-------|-----------|
| **Entity** | Objeto com identidade única e ciclo de vida |
| **Value Object** | Objeto sem identidade, definido por atributos |
| **Repository** | Abstração para persistência de aggregates |
| **Use Case** | Ação que o sistema pode realizar |
| **DTO** | Data Transfer Object - objeto para transporte de dados |
| **Mapper** | Converte entre diferentes representações |
| **Aggregate** | Cluster de entities tratadas como unidade |
| **Domain Event** | Algo que aconteceu no domínio |
| **Bounded Context** | Limite conceitual de um modelo de domínio |

---

**Última atualização**: 25 de Dezembro de 2025
**Versão do documento**: 1.0
**Mantenedor**: Equipe Lead2Pack
