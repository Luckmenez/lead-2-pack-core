# Exemplos de Payloads da API

Este documento contém exemplos completos de requisições para criar diferentes tipos de usuários no sistema Lead2Pack.

## 📋 Índice

1. [Registro de Usuários](#registro-de-usuários)
   - [Customer (Cliente)](#1-customer-cliente)
   - [Supplier (Fornecedor)](#2-supplier-fornecedor)
   - [Sector Professional (Profissional de Setor)](#3-sector-professional-profissional-de-setor)
2. [Login](#login)
3. [Autenticação de Collaborator (Admin)](#autenticação-de-collaborator-admin)
4. [Respostas da API](#respostas-da-api)

---

## 🔐 Registro de Usuários

### Endpoint
```
POST /auth/register
Content-Type: application/json
```

---

## 1. CUSTOMER (Cliente)

**Descrição**: Empresas que buscam fornecedores para suas obras/projetos.

### Payload de Exemplo

```json
{
  "email": "contato@construtoraexemplo.com.br",
  "password": "SenhaSegura123!",
  "role": "CUSTOMER",
  "profileData": {
    "companyFullName": "Construtora Exemplo Ltda",
    "legalName": "CONSTRUTORA EXEMPLO LTDA",
    "tradeName": "Construtora Exemplo",
    "cnpj": "12.345.678/0001-90",
    "corporateEmail": "financeiro@construtoraexemplo.com.br",
    "whatsapp": "+55 11 98765-4321",
    "address": "Av. Paulista, 1000 - São Paulo, SP",
    "website": "https://www.construtoraexemplo.com.br"
  }
}
```

### Campos Obrigatórios (profileData)

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `companyFullName` | string | Nome completo da empresa | 3-255 caracteres |
| `legalName` | string | Razão social | Obrigatório |
| `tradeName` | string | Nome fantasia | Obrigatório |
| `cnpj` | string | CNPJ da empresa | Formato válido: XX.XXX.XXX/XXXX-XX |
| `corporateEmail` | string | Email corporativo | Email válido |
| `whatsapp` | string | WhatsApp de contato | Obrigatório |

### Campos Opcionais (profileData)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `address` | string | Endereço completo |
| `website` | string | Site da empresa |

---

## 2. SUPPLIER (Fornecedor)

**Descrição**: Empresas que fornecem materiais/serviços para obras.

### Payload de Exemplo

```json
{
  "email": "vendas@fornecedorpro.com.br",
  "password": "Forn3c3dor@2024",
  "role": "SUPPLIER",
  "profileData": {
    "companyFullName": "Fornecedor Pro Materiais de Construção Ltda",
    "legalName": "FORNECEDOR PRO MATERIAIS DE CONSTRUÇÃO LTDA",
    "tradeName": "Fornecedor Pro",
    "cnpj": "98.765.432/0001-10",
    "corporateEmail": "comercial@fornecedorpro.com.br",
    "whatsapp": "+55 21 97654-3210",
    "contactName": "João da Silva",
    "address": "Rua dos Fornecedores, 500 - Rio de Janeiro, RJ"
  },
  "sectorIds": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440003"
  ]
}
```

### Campos Obrigatórios (profileData)

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `companyFullName` | string | Nome completo da empresa | Obrigatório |
| `legalName` | string | Razão social | Obrigatório |
| `tradeName` | string | Nome fantasia | Obrigatório |
| `cnpj` | string | CNPJ da empresa | Formato válido: XX.XXX.XXX/XXXX-XX |
| `corporateEmail` | string | Email corporativo | Email válido |
| `whatsapp` | string | WhatsApp de contato | Obrigatório |
| `contactName` | string | Nome do contato principal | Obrigatório |

### Campos Opcionais (profileData)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `address` | string | Endereço completo |

### Campo sectorIds (Raiz do Payload)

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `sectorIds` | string[] | Array de IDs dos setores de atuação | Mínimo 1, máximo 5 UUIDs |

⚠️ **IMPORTANTE**: O campo `sectorIds` é obrigatório para SUPPLIER e deve conter entre 1 e 5 IDs de setores válidos. Para obter os IDs disponíveis, consulte o endpoint `GET /sectors`.

---

## 3. SECTOR_PROFESSIONAL (Profissional de Setor)

**Descrição**: Profissionais autônomos (eletricistas, encanadores, pedreiros, etc.).

### Payload de Exemplo

```json
{
  "email": "jose.eletricista@gmail.com",
  "password": "El3tric1sta@Seguro",
  "role": "SECTOR_PROFESSIONAL",
  "profileData": {
    "fullName": "José Carlos da Silva",
    "tradeName": "JC Eletricista",
    "cpf": "123.456.789-00",
    "corporateEmail": "contato@jceletricista.com.br",
    "whatsapp": "+55 11 99876-5432",
    "address": "Rua das Flores, 123 - Guarulhos, SP"
  },
  "sectorIds": [
    "550e8400-e29b-41d4-a716-446655440001"
  ]
}
```

### Campos Obrigatórios (profileData)

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `fullName` | string | Nome completo do profissional | Obrigatório |
| `cpf` | string | CPF do profissional | Formato válido: XXX.XXX.XXX-XX |
| `corporateEmail` | string | Email de contato | Email válido |
| `whatsapp` | string | WhatsApp de contato | Obrigatório |

### Campos Opcionais (profileData)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `tradeName` | string | Nome comercial/fantasia |
| `address` | string | Endereço completo |

### Campo sectorIds (Raiz do Payload)

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `sectorIds` | string[] | Array de IDs dos setores de atuação | Mínimo 1, máximo 5 UUIDs |

⚠️ **IMPORTANTE**: O campo `sectorIds` é obrigatório para SECTOR_PROFESSIONAL e deve conter entre 1 e 5 IDs de setores válidos. Para obter os IDs disponíveis, consulte o endpoint `GET /sectors`.

---

## 📝 Comparação entre Roles

| Característica | CUSTOMER | SUPPLIER | SECTOR_PROFESSIONAL |
|---------------|----------|----------|---------------------|
| **Tipo de pessoa** | Jurídica (CNPJ) | Jurídica (CNPJ) | Física (CPF) |
| **Documento** | CNPJ | CNPJ | CPF |
| **Razão Social** | ✅ Sim | ✅ Sim | ❌ Não |
| **Nome Fantasia** | ✅ Sim | ✅ Sim | ⚠️ Opcional |
| **Nome Completo** | ✅ companyFullName | ✅ companyFullName | ✅ fullName |
| **Contato Principal** | ❌ Não | ✅ contactName | ✅ fullName |
| **Website** | ⚠️ Opcional | ❌ Não | ❌ Não |
| **Setores (sectorIds)** | ❌ Não | ✅ Obrigatório (1-5) | ✅ Obrigatório (1-5) |

---

## 🏢 Gerenciamento de Setores

### O que são Setores?

Setores representam as áreas de atuação dos fornecedores e profissionais (ex: elétrica, hidráulica, construção civil, etc.).

### Quem precisa de Setores?

- ✅ **SUPPLIER**: Deve informar em quais setores a empresa atua (1-5 setores)
- ✅ **SECTOR_PROFESSIONAL**: Deve informar em quais setores o profissional trabalha (1-5 setores)
- ❌ **CUSTOMER**: Não precisa informar setores (clientes buscam fornecedores)

### Como obter os IDs dos Setores?

Antes de registrar um SUPPLIER ou SECTOR_PROFESSIONAL, você precisa consultar os setores disponíveis:

#### Endpoint: Listar Setores

```
GET /sectors
```

#### Resposta de Exemplo

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Elétrica",
      "description": "Serviços e materiais elétricos",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Hidráulica",
      "description": "Serviços e materiais hidráulicos",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Construção Civil",
      "description": "Materiais e serviços de construção civil",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "metadata": {
    "timestamp": "2024-12-25T15:30:00.000Z"
  }
}
```

### Fluxo Completo: Registrar SUPPLIER

1. **Buscar setores disponíveis**:
   ```bash
   curl -X GET http://localhost:3000/sectors
   ```

2. **Copiar os IDs dos setores desejados** (ex: Elétrica, Hidráulica)

3. **Registrar o fornecedor** incluindo `sectorIds`:
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "vendas@fornecedor.com",
       "password": "Senha123!",
       "role": "SUPPLIER",
       "profileData": { ... },
       "sectorIds": [
         "550e8400-e29b-41d4-a716-446655440001",
         "550e8400-e29b-41d4-a716-446655440002"
       ]
     }'
   ```

---

## 🔓 Login

### Endpoint
```
POST /auth/login
Content-Type: application/json
```

### Payload

```json
{
  "email": "contato@construtoraexemplo.com.br",
  "password": "SenhaSegura123!"
}
```

### Resposta de Sucesso (200 OK)

```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "contato@construtoraexemplo.com.br",
    "role": "CUSTOMER",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "metadata": {
    "timestamp": "2024-12-25T15:30:00.000Z"
  }
}
```

---

## 👔 Autenticação de Collaborator (Admin)

### Endpoint
```
POST /admin/auth/login
Content-Type: application/json
```

### Payload

```json
{
  "email": "admin@lead2pack.com",
  "password": "Admin@123"
}
```

### Resposta de Sucesso (200 OK)

```json
{
  "success": true,
  "data": {
    "collaboratorId": "660e8400-e29b-41d4-a716-446655440000",
    "email": "admin@lead2pack.com",
    "role": "ADMIN",
    "name": "Administrator",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "metadata": {
    "timestamp": "2024-12-25T15:30:00.000Z"
  }
}
```

---

## ✅ Respostas da API

### Registro de Usuário - Sucesso (201 Created)

```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "contato@construtoraexemplo.com.br",
    "role": "CUSTOMER",
    "profileData": {
      "companyFullName": "Construtora Exemplo Ltda",
      "legalName": "CONSTRUTORA EXEMPLO LTDA",
      "tradeName": "Construtora Exemplo",
      "cnpj": "12.345.678/0001-90",
      "corporateEmail": "financeiro@construtoraexemplo.com.br",
      "whatsapp": "+55 11 98765-4321",
      "address": "Av. Paulista, 1000 - São Paulo, SP",
      "website": "https://www.construtoraexemplo.com.br"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "metadata": {
    "timestamp": "2024-12-25T15:30:00.000Z"
  }
}
```

---

## ❌ Erros Comuns

### 1. Email já cadastrado (409 Conflict)

```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "Conflict"
}
```

### 2. Validação de profileData falhou (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": {
    "message": "Profile data validation failed",
    "errors": [
      {
        "field": "cnpj",
        "errors": ["CNPJ inválido"]
      },
      {
        "field": "corporateEmail",
        "errors": ["corporateEmail must be an email"]
      }
    ]
  },
  "error": "Bad Request"
}
```

### 3. Senha fraca (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": [
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```

### 4. Role inválido (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": [
    "role must be one of the following values: CUSTOMER, SUPPLIER, SECTOR_PROFESSIONAL"
  ],
  "error": "Bad Request"
}
```

### 5. CPF inválido (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": {
    "message": "Profile data validation failed",
    "errors": [
      {
        "field": "cpf",
        "errors": ["CPF inválido"]
      }
    ]
  },
  "error": "Bad Request"
}
```

### 6. CNPJ inválido (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": {
    "message": "Profile data validation failed",
    "errors": [
      {
        "field": "cnpj",
        "errors": ["CNPJ inválido"]
      }
    ]
  },
  "error": "Bad Request"
}
```

### 7. sectorIds ausente para SUPPLIER/SECTOR_PROFESSIONAL (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": [
    "sectorIds must be an array",
    "sectorIds should not be empty"
  ],
  "error": "Bad Request"
}
```

### 8. sectorIds com mais de 5 setores (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": [
    "sectorIds must contain no more than 5 elements"
  ],
  "error": "Bad Request"
}
```

### 9. sectorIds com IDs inválidos (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": [
    "each value in sectorIds must be a UUID"
  ],
  "error": "Bad Request"
}
```

### 10. Setor não encontrado (404 Not Found)

```json
{
  "statusCode": 404,
  "message": "Sector with ID '550e8400-e29b-41d4-a716-446655440099' not found",
  "error": "Not Found"
}
```

---

## 🧪 Testando com cURL

### Registrar Customer

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contato@construtoraexemplo.com.br",
    "password": "SenhaSegura123!",
    "role": "CUSTOMER",
    "profileData": {
      "companyFullName": "Construtora Exemplo Ltda",
      "legalName": "CONSTRUTORA EXEMPLO LTDA",
      "tradeName": "Construtora Exemplo",
      "cnpj": "12.345.678/0001-90",
      "corporateEmail": "financeiro@construtoraexemplo.com.br",
      "whatsapp": "+55 11 98765-4321",
      "address": "Av. Paulista, 1000 - São Paulo, SP",
      "website": "https://www.construtoraexemplo.com.br"
    }
  }'
```

### Registrar Supplier

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendas@fornecedorpro.com.br",
    "password": "Forn3c3dor@2024",
    "role": "SUPPLIER",
    "profileData": {
      "companyFullName": "Fornecedor Pro Materiais de Construção Ltda",
      "legalName": "FORNECEDOR PRO MATERIAIS DE CONSTRUÇÃO LTDA",
      "tradeName": "Fornecedor Pro",
      "cnpj": "98.765.432/0001-10",
      "corporateEmail": "comercial@fornecedorpro.com.br",
      "whatsapp": "+55 21 97654-3210",
      "contactName": "João da Silva",
      "address": "Rua dos Fornecedores, 500 - Rio de Janeiro, RJ"
    },
    "sectorIds": [
      "550e8400-e29b-41d4-a716-446655440001",
      "550e8400-e29b-41d4-a716-446655440002",
      "550e8400-e29b-41d4-a716-446655440003"
    ]
  }'
```

### Registrar Sector Professional

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jose.eletricista@gmail.com",
    "password": "El3tric1sta@Seguro",
    "role": "SECTOR_PROFESSIONAL",
    "profileData": {
      "fullName": "José Carlos da Silva",
      "tradeName": "JC Eletricista",
      "cpf": "123.456.789-00",
      "corporateEmail": "contato@jceletricista.com.br",
      "whatsapp": "+55 11 99876-5432",
      "address": "Rua das Flores, 123 - Guarulhos, SP"
    },
    "sectorIds": [
      "550e8400-e29b-41d4-a716-446655440001"
    ]
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contato@construtoraexemplo.com.br",
    "password": "SenhaSegura123!"
  }'
```

### Login Admin

```bash
curl -X POST http://localhost:3000/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lead2pack.com",
    "password": "Admin@123"
  }'
```

---

## 🧪 Testando com Postman/Insomnia

### 1. Criar uma requisição POST

- **URL**: `http://localhost:3000/auth/register`
- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`

### 2. Body (JSON)

Cole um dos payloads de exemplo acima.

### 3. Enviar

Você deve receber uma resposta 201 Created com os dados do usuário e o token JWT.

### 4. Usar o token

Para endpoints protegidos, adicione o header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Notas Importantes

### Validações de Documento

- **CPF**: Formato `XXX.XXX.XXX-XX` com validação de dígitos verificadores
- **CNPJ**: Formato `XX.XXX.XXX/XXXX-XX` com validação de dígitos verificadores

### Validações de Senha

A senha deve ter:
- ✅ Mínimo de 8 caracteres
- ✅ Máximo de 100 caracteres
- ⚠️ Recomendado: letras maiúsculas, minúsculas, números e caracteres especiais

### Validações de Email

- ✅ Formato válido de email
- ✅ Email único no sistema (não pode duplicar)

### ProfileData Obrigatório

⚠️ **IMPORTANTE**: Desde a Fase 4, todos os usuários **DEVEM** ter `profileData`. Não é mais possível criar usuários sem esse campo.

### SectorIds Obrigatório para SUPPLIER e SECTOR_PROFESSIONAL

⚠️ **IMPORTANTE**:
- **SUPPLIER** e **SECTOR_PROFESSIONAL** DEVEM informar `sectorIds`
- Mínimo: 1 setor
- Máximo: 5 setores
- Todos os IDs devem ser UUIDs válidos
- Todos os setores devem existir no banco de dados
- **CUSTOMER** NÃO usa `sectorIds`

### Separação User vs Collaborator

- **Users** (CUSTOMER, SUPPLIER, SECTOR_PROFESSIONAL):
  - Endpoint: `/auth/*`
  - Sempre têm `profileData`

- **Collaborators** (ADMIN, SUPPORT, MODERATOR):
  - Endpoint: `/admin/auth/*`
  - Têm apenas `name`, `role`, `isActive`

---

## 🔗 Endpoints Relacionados

### Users

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login de usuário
- `GET /users/:id` - Buscar usuário por ID (protegido)
- `PATCH /users/:id` - Atualizar usuário (protegido)

### Collaborators

- `POST /admin/auth/login` - Login de collaborator
- `POST /admin/collaborators` - Criar collaborator (protegido, apenas admins)
- `GET /admin/collaborators/:id` - Buscar collaborator (protegido)

### Sectors

- `GET /sectors` - Listar todos os setores disponíveis
- `GET /sectors/:id` - Buscar setor por ID
- `POST /sectors` - Criar novo setor (protegido, apenas admins)
- `PATCH /sectors/:id` - Atualizar setor (protegido, apenas admins)
- `DELETE /sectors/:id` - Deletar setor (protegido, apenas admins)

---

**Última atualização**: 25 de Dezembro de 2025
**Versão do documento**: 1.1

---

## 📝 Changelog

### v1.1 (25/12/2025)
- ✅ Adicionado campo `sectorIds` para SUPPLIER e SECTOR_PROFESSIONAL
- ✅ Adicionada seção "Gerenciamento de Setores"
- ✅ Adicionados exemplos de erros relacionados a `sectorIds`
- ✅ Atualizada tabela comparativa com informação de setores
- ✅ Adicionados endpoints de setores

### v1.0 (25/12/2025)
- ✅ Versão inicial com exemplos de CUSTOMER, SUPPLIER e SECTOR_PROFESSIONAL
- ✅ Exemplos de payloads completos
- ✅ Comandos cURL
- ✅ Respostas de erro
