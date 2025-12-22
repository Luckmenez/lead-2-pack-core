# Guia de Uso do Módulo de Autenticação

## Resumo da Separação

✅ **Módulo Auth criado com sucesso!**

A aplicação agora tem dois módulos separados:
- **UsersModule**: Gestão de usuários (CRUD, entidade User, repositório)
- **AuthModule**: Autenticação e autorização (login, JWT, guards, strategies)

## Estrutura Criada

```
src/modules/
├── auth/                                     # ✅ NOVO MÓDULO
│   ├── domain/
│   │   └── interfaces/
│   │       └── jwt-payload.interface.ts
│   ├── application/
│   │   └── use-cases/
│   │       └── login/
│   │           ├── login.use-case.ts
│   │           └── login.dto.ts
│   ├── infrastructure/
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts              # Passport JWT Strategy
│   │   │   └── local.strategy.ts            # Passport Local Strategy
│   │   └── guards/
│   │       ├── jwt-auth.guard.ts            # Guard de autenticação
│   │       └── roles.guard.ts               # Guard de roles
│   ├── presentation/
│   │   ├── controllers/
│   │   │   └── auth.controller.ts
│   │   ├── dtos/
│   │   │   ├── login-request.dto.ts
│   │   │   └── auth-response.dto.ts
│   │   └── decorators/
│   │       ├── current-user.decorator.ts    # @CurrentUser()
│   │       ├── roles.decorator.ts           # @Roles()
│   │       └── public.decorator.ts          # @Public()
│   └── auth.module.ts
│
└── users/                                    # MÓDULO EXISTENTE (LIMPO)
    └── ... (sem código de auth)
```

## Como Usar os Decorators e Guards

### 1. Rota Pública (sem autenticação necessária)

Use o decorator `@Public()` para rotas que não precisam de autenticação:

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { Public } from '@modules/auth/presentation/decorators/public.decorator';

@Controller('auth')
export class AuthController {

  @Public() // ← Esta rota não requer autenticação
  @Post('login')
  async login(@Body() dto: LoginRequestDto) {
    // ...
  }
}
```

**Exemplos de rotas públicas:**
- `POST /auth/login` - Login
- `POST /users` - Registro de novo usuário

### 2. Rota Protegida (requer autenticação)

Para proteger uma rota, você precisa:

**Opção A: Aplicar guard globalmente (RECOMENDADO)**

No `main.ts`, aplique o JwtAuthGuard globalmente:

```typescript
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from '@modules/auth/infrastructure/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aplicar JwtAuthGuard globalmente
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.listen(3000);
}
bootstrap();
```

Com isso, **todas as rotas são protegidas por padrão**, exceto as marcadas com `@Public()`.

**Opção B: Aplicar guard em rotas específicas**

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/infrastructure/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) // ← Protege todas as rotas deste controller
export class UsersController {

  @Get('profile')
  async getProfile() {
    // Requer autenticação
  }
}
```

### 3. Acessar Usuário Autenticado

Use o decorator `@CurrentUser()` para acessar os dados do usuário autenticado:

```typescript
import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '@modules/auth/presentation/decorators/current-user.decorator';

@Controller('users')
export class UsersController {

  @Get('me')
  async getMyProfile(@CurrentUser() user: any) {
    // user contém: { id, email, name, role }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
```

### 4. Controle de Acesso por Role (RBAC)

Use o decorator `@Roles()` junto com o `RolesGuard`:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/infrastructure/guards/roles.guard';
import { Roles } from '@modules/auth/presentation/decorators/roles.decorator';
import { CurrentUser } from '@modules/auth/presentation/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // ← Aplica ambos os guards
export class UsersController {

  @Get('suppliers')
  @Roles('ADMIN') // ← Apenas ADMINs podem acessar
  async listSuppliers(@CurrentUser() user: any) {
    // Apenas usuários com role "ADMIN" chegam aqui
  }

  @Get('dashboard')
  @Roles('ADMIN', 'SUPPLIER') // ← ADMINs OU SUPPLIERs podem acessar
  async getDashboard(@CurrentUser() user: any) {
    // Lógica diferente por role
    if (user.role === 'ADMIN') {
      // Dashboard de admin
    } else {
      // Dashboard de supplier
    }
  }
}
```

## Exemplos Práticos Completos

### Exemplo 1: Endpoint Público de Login

```typescript
// src/modules/auth/presentation/controllers/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { LoginRequestDto } from '../dtos/login-request.dto';

@Controller('auth')
export class AuthController {

  @Public()
  @Post('login')
  async login(@Body() dto: LoginRequestDto) {
    // Login não requer autenticação prévia
    return this.loginUseCase.execute(dto);
  }
}
```

### Exemplo 2: Endpoint Protegido com Dados do Usuário

```typescript
// src/modules/users/presentation/controllers/users.controller.ts
import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '@modules/auth/presentation/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {

  @Get('me')
  async getMyProfile(@CurrentUser() user: any) {
    return this.getUserByIdUseCase.execute(user.id);
  }

  @Patch('me')
  async updateMyProfile(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateUserDto
  ) {
    return this.updateUserUseCase.execute(user.id, updateDto);
  }
}
```

### Exemplo 3: Endpoint Restrito por Role

```typescript
// src/modules/users/presentation/controllers/users.controller.ts
import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/infrastructure/guards/roles.guard';
import { Roles } from '@modules/auth/presentation/decorators/roles.decorator';
import { CurrentUser } from '@modules/auth/presentation/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {

  @Get()
  @Roles('ADMIN')
  async listAllUsers(@CurrentUser() admin: any) {
    // Apenas ADMINs podem listar todos os usuários
    return this.listUsersUseCase.execute();
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() admin: any
  ) {
    // Apenas ADMINs podem deletar usuários
    return this.deleteUserUseCase.execute(id);
  }
}
```

## Testando a Autenticação

### 1. Login (obter token)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMIN",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Acessar rota protegida (com token)

```bash
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Acessar rota restrita por role

```bash
# Com token de ADMIN - ✅ Sucesso
curl -X GET http://localhost:3000/users/suppliers \
  -H "Authorization: Bearer <admin-token>"

# Com token de CUSTOMER - ❌ Erro 403 Forbidden
curl -X GET http://localhost:3000/users/suppliers \
  -H "Authorization: Bearer <customer-token>"
```

## Próximos Passos (Fase 2)

Para ativar a proteção global de rotas, adicione no `src/main.ts`:

```typescript
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from '@modules/auth/infrastructure/guards/jwt-auth.guard';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // JWT Guard Global (protege todas as rotas por padrão)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.listen(3000);
}
bootstrap();
```

## Estrutura de Dependências

```
AuthModule
    ↓ imports
UsersModule
    ↓ exports
- IUserRepository
- BcryptPasswordHasherService
- GetUserByIdUseCase
```

**Auth depende de Users**, mas Users NÃO depende de Auth.

## Resumo das Responsabilidades

### UsersModule
- ✅ Entidade User (domain)
- ✅ CRUD de usuários
- ✅ Repositório de usuários
- ✅ Hash de senhas (bcrypt)
- ✅ Value objects (Email, Password)

### AuthModule
- ✅ Login e geração de tokens
- ✅ Validação de JWT (JwtStrategy)
- ✅ Guards de autenticação (JwtAuthGuard)
- ✅ Guards de autorização (RolesGuard)
- ✅ Decorators (@CurrentUser, @Roles, @Public)
- ✅ Strategies do Passport (JWT, Local)
