# Arquitetura Multi-Persona - Lead2Pack

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura Backend](#arquitetura-backend)
3. [Estratégia Frontend](#estratégia-frontend)
4. [Migrations e Database](#migrations-e-database)
5. [Exemplos Práticos](#exemplos-práticos)

---

## Visão Geral

O Lead2Pack é um marketplace B2B com **3 personas distintas**, cada uma com campos específicos:

- **CUSTOMER (Comprador)** - Empresas que compram embalagens
- **SUPPLIER (Fornecedor)** - Empresas que fornecem embalagens
- **SECTOR_PROFESSIONAL (Profissional do Setor)** - Profissionais autônomos

### Decisão Arquitetural: JSONB Pure

Optamos pela abordagem **JSONB Pure** onde:
- ✅ Dados compartilhados = colunas normais (`email`, `password`, `role`)
- ✅ Dados específicos da persona = `profile_data` (JSONB)
- ✅ Zero colunas NULL para campos específicos
- ✅ Índices parciais garantem performance equivalente a colunas normais

---

## Arquitetura Backend

### Estrutura da Tabela `users`

```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password        VARCHAR(255) NOT NULL,
  role            users_role_enum NOT NULL DEFAULT 'CUSTOMER',
  profile_data    JSONB,
  created_at      TIMESTAMP NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP NOT NULL DEFAULT now()
);
```

### Estrutura do `profile_data` por Persona

#### CUSTOMER
```json
{
  "companyFullName": "Embalagens ABC Ltda",
  "legalName": "ABC Embalagens Ltda ME",
  "tradeName": "Embalagens ABC",
  "cnpj": "12345678000190",
  "corporateEmail": "contato@abc.com",
  "whatsapp": "11999999999",
  "address": "Rua X, 123",
  "website": "https://abc.com",
  "phone": "1133334444"
}
```

#### SUPPLIER
```json
{
  "companyFullName": "Fornecedor XYZ SA",
  "legalName": "XYZ Fornecimentos SA",
  "tradeName": "XYZ Supply",
  "cnpj": "98765432000100",
  "corporateEmail": "vendas@xyz.com",
  "whatsapp": "11888888888",
  "contactName": "João Silva",
  "address": "Av Y, 456",
  "website": "https://xyz.com",
  "phone": "1122223333"
}
```

#### SECTOR_PROFESSIONAL
```json
{
  "fullName": "Maria Santos",
  "tradeName": "Maria Design",
  "cpf": "12345678901",
  "corporateEmail": "maria@design.com",
  "whatsapp": "11777777777",
  "contactName": "Maria Santos",
  "address": "Rua Z, 789",
  "website": "https://mariadesign.com",
  "phone": "1144445555"
}
```

### Índices para Performance

```sql
-- Índice GIN geral para JSONB
CREATE INDEX idx_users_profile_data ON users USING GIN (profile_data);

-- Índices parciais para buscas frequentes
CREATE INDEX idx_users_cnpj ON users ((profile_data->>'cnpj'))
WHERE role IN ('CUSTOMER', 'SUPPLIER');

CREATE INDEX idx_users_cpf ON users ((profile_data->>'cpf'))
WHERE role = 'SECTOR_PROFESSIONAL';

CREATE INDEX idx_users_trade_name ON users ((profile_data->>'tradeName'));

CREATE INDEX idx_users_full_name ON users ((profile_data->>'fullName'))
WHERE role = 'SECTOR_PROFESSIONAL';

CREATE INDEX idx_users_company_full_name ON users ((profile_data->>'companyFullName'))
WHERE role IN ('CUSTOMER', 'SUPPLIER');
```

### Queries Otimizadas

```sql
-- Buscar por CNPJ (performance idêntica a coluna normal)
SELECT * FROM users
WHERE profile_data->>'cnpj' = '12345678000190';

-- Buscar por CPF
SELECT * FROM users
WHERE profile_data->>'cpf' = '12345678901';

-- Buscar por nome da empresa (case-insensitive)
SELECT * FROM users
WHERE profile_data->>'tradeName' ILIKE '%ABC%';
```

### Exemplo de Entity

```typescript
// src/modules/users/domain/entities/user.entity.ts
export class UserEntity extends BaseEntity {
  private _email: Email;
  private _password: Password;
  private _role: UserRole;
  private _profileData?: ProfileData; // ← Dados específicos aqui

  static create(props: CreateUserProps): UserEntity {
    const now = new Date();
    return new UserEntity({
      id: uuidv4(),
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  get profileData(): ProfileData | undefined {
    return this._profileData;
  }

  updateProfileData(profileData: ProfileData): void {
    this._profileData = profileData;
    this._updatedAt = new Date();
  }
}
```

### Helper no Backend para Frontend

```typescript
// src/modules/users/presentation/dtos/user-response.dto.ts
export class UserResponseDto {
  id: string;
  email: string;
  role: UserRole;
  profileData?: Record<string, any>;
  displayName?: string; // ← Helper calculado no backend

  static fromEntity(entity: UserEntity): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email.value,
      role: entity.role,
      profileData: entity.profileData,
      displayName: this.getDisplayName(entity), // ← Facilita o frontend
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private static getDisplayName(entity: UserEntity): string {
    const profile = entity.profileData as any;

    switch (entity.role) {
      case UserRole.CUSTOMER:
      case UserRole.SUPPLIER:
        return profile?.tradeName || profile?.companyFullName || entity.email.value;
      case UserRole.SECTOR_PROFESSIONAL:
        return profile?.tradeName || profile?.fullName || entity.email.value;
      default:
        return entity.email.value;
    }
  }
}
```

---

## Estratégia Frontend

### 🎯 Princípio: Component Composition + Dynamic Forms

**NÃO criar 4 aplicações separadas**, mas sim **compor componentes dinamicamente** baseado no `role`.

### 1. Form Schemas Dinâmicos

```typescript
// frontend/src/schemas/user-profile.schema.ts

export const USER_PROFILE_SCHEMAS = {
  CUSTOMER: {
    fields: [
      { name: 'companyFullName', type: 'text', label: 'Razão Social', required: true },
      { name: 'tradeName', type: 'text', label: 'Nome Fantasia', required: true },
      { name: 'cnpj', type: 'cnpj', label: 'CNPJ', required: true, mask: '99.999.999/9999-99' },
      { name: 'corporateEmail', type: 'email', label: 'Email Corporativo', required: true },
      { name: 'whatsapp', type: 'tel', label: 'WhatsApp', required: true },
      { name: 'address', type: 'text', label: 'Endereço', required: false },
      { name: 'website', type: 'url', label: 'Website', required: false },
    ],
    layout: 'company',
  },

  SUPPLIER: {
    fields: [
      { name: 'companyFullName', type: 'text', label: 'Razão Social', required: true },
      { name: 'tradeName', type: 'text', label: 'Nome Fantasia', required: true },
      { name: 'cnpj', type: 'cnpj', label: 'CNPJ', required: true },
      { name: 'contactName', type: 'text', label: 'Nome do Contato', required: true },
      { name: 'corporateEmail', type: 'email', label: 'Email Corporativo', required: true },
      { name: 'whatsapp', type: 'tel', label: 'WhatsApp', required: true },
    ],
    layout: 'company',
  },

  SECTOR_PROFESSIONAL: {
    fields: [
      { name: 'fullName', type: 'text', label: 'Nome Completo', required: true },
      { name: 'tradeName', type: 'text', label: 'Nome Comercial', required: false },
      { name: 'cpf', type: 'cpf', label: 'CPF', required: true, mask: '999.999.999-99' },
      { name: 'corporateEmail', type: 'email', label: 'Email', required: true },
      { name: 'whatsapp', type: 'tel', label: 'WhatsApp', required: true },
    ],
    layout: 'individual',
  },
};
```

### 2. Componente Dinâmico de Formulário

```typescript
// frontend/src/components/DynamicUserForm.tsx

interface DynamicUserFormProps {
  role: UserRole;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function DynamicUserForm({ role, onSubmit, initialData }: DynamicUserFormProps) {
  const schema = USER_PROFILE_SCHEMAS[role];
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`layout-${schema.layout}`}>
      {schema.fields.map((field) => (
        <FormField
          key={field.name}
          {...field}
          register={register}
          errors={errors}
        />
      ))}

      <button type="submit">Salvar</button>
    </form>
  );
}
```

### 3. Componente de Visualização

```typescript
// frontend/src/components/UserProfileView.tsx

export function UserProfileView({ user }: { user: User }) {
  const schema = USER_PROFILE_SCHEMAS[user.role];
  const profileData = user.profileData;

  return (
    <div className={`profile-view layout-${schema.layout}`}>
      <header>
        <Avatar />
        <h1>{user.displayName}</h1> {/* ← Helper do backend */}
        <Badge>{getRoleLabel(user.role)}</Badge>
      </header>

      <section className="profile-details">
        {schema.fields.map((field) => (
          <ProfileField
            key={field.name}
            label={field.label}
            value={profileData[field.name]}
            type={field.type}
          />
        ))}
      </section>
    </div>
  );
}
```

### 4. Fluxo de Registro

```typescript
// frontend/src/pages/Register.tsx

export function RegisterPage() {
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Passo 1: Escolher persona
  if (step === 'role') {
    return (
      <RoleSelector
        roles={[
          { value: 'CUSTOMER', label: 'Sou Comprador', icon: <ShoppingBag /> },
          { value: 'SUPPLIER', label: 'Sou Fornecedor', icon: <Truck /> },
          { value: 'SECTOR_PROFESSIONAL', label: 'Sou Profissional', icon: <User /> },
        ]}
        onSelect={(role) => {
          setSelectedRole(role);
          setStep('form');
        }}
      />
    );
  }

  // Passo 2: Formulário dinâmico
  return (
    <DynamicUserForm
      role={selectedRole!}
      onSubmit={async (data) => {
        await api.post('/users', {
          email: data.email,
          password: data.password,
          role: selectedRole,
          profileData: data,
        });
      }}
    />
  );
}
```

### 5. Layouts com CSS

```css
/* frontend/src/styles/profiles.css */

/* Layout para empresas */
.profile-view[data-role="CUSTOMER"],
.profile-view[data-role="SUPPLIER"] {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

/* Layout para profissionais */
.profile-view[data-role="SECTOR_PROFESSIONAL"] {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
}
```

### 6. Estrutura de Pastas Frontend

```
frontend/src/
├── schemas/
│   └── user-profile.schema.ts       # Definições de campos por role
│
├── components/
│   ├── shared/                       # Componentes compartilhados
│   │   ├── DynamicForm.tsx
│   │   ├── FormField.tsx
│   │   ├── ProfileField.tsx
│   │   └── Badge.tsx
│   │
│   ├── profiles/                     # Componentes específicos
│   │   ├── UserProfile.tsx           # Router principal
│   │   ├── CompanyProfile.tsx        # CUSTOMER/SUPPLIER
│   │   └── ProfessionalProfile.tsx   # SECTOR_PROFESSIONAL
│   │
│   └── forms/
│       └── UserRegistrationForm.tsx
│
├── hooks/
│   └── useUserProfile.ts             # Lógica de negócio
│
└── utils/
    ├── user-helpers.ts               # getDisplayName, getRoleLabel
    └── validators.ts                 # CPF, CNPJ
```

---

## Migrations e Database

### Comandos Úteis

```bash
# Gerar migration automática (detecta mudanças em Schemas)
npm run migration:generate -- src/core/database/migrations/NomeDaMigration

# Criar migration vazia (para lógica customizada)
npm run migration:create -- src/core/database/migrations/NomeDaMigration

# Executar migrations pendentes
npm run migration:run

# Ver status das migrations
npm run typeorm -- migration:show -d src/core/database/typeorm.config.ts

# Reverter última migration
npm run typeorm -- migration:revert -d src/core/database/typeorm.config.ts
```

### Exemplo: Criar Nova Tabela

**Método 1: Auto-gerada**

```bash
# 1. Criar/modificar o Schema
# src/modules/products/infrastructure/persistence/product.schema.ts

# 2. Gerar migration
npm run migration:generate -- src/core/database/migrations/CreateProductsTable

# 3. Executar
npm run migration:run
```

**Método 2: Manual**

```bash
# 1. Criar migration vazia
npm run migration:create -- src/core/database/migrations/CreateProductsTable

# 2. Editar arquivo gerado
# 3. Executar
npm run migration:run
```

### Exemplo de Migration Manual

```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductsTable1735359000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
```

---

## Exemplos Práticos

### Backend: Criar Usuário

```bash
POST /api/users
Content-Type: application/json

{
  "email": "contato@abc.com",
  "password": "SecurePass123",
  "role": "CUSTOMER",
  "profileData": {
    "companyFullName": "Embalagens ABC Ltda",
    "tradeName": "ABC Embalagens",
    "cnpj": "12345678000190",
    "corporateEmail": "contato@abc.com",
    "whatsapp": "11999999999"
  }
}
```

### Backend: Buscar Usuário por CNPJ

```typescript
// src/modules/users/infrastructure/repositories/user.repository.ts

async findByCnpj(cnpj: string): Promise<UserEntity | null> {
  const schema = await this.repository
    .createQueryBuilder('user')
    .where("user.profile_data->>'cnpj' = :cnpj", { cnpj })
    .andWhere("user.role IN ('CUSTOMER', 'SUPPLIER')")
    .getOne();

  return schema ? UserMapper.toDomain(schema) : null;
}
```

### Frontend: Componente Field Dinâmico

```typescript
// frontend/src/components/shared/FormField.tsx

interface FormFieldProps {
  name: string;
  type: string;
  label: string;
  required: boolean;
  mask?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export function FormField({ name, type, label, required, mask, register, errors }: FormFieldProps) {
  const renderInput = () => {
    switch (type) {
      case 'cnpj':
        return <InputMask mask="99.999.999/9999-99" {...register(name, { required })} />;
      case 'cpf':
        return <InputMask mask="999.999.999-99" {...register(name, { required })} />;
      case 'tel':
        return <InputMask mask="(99) 99999-9999" {...register(name, { required })} />;
      default:
        return <input type={type} {...register(name, { required })} />;
    }
  };

  return (
    <div className="form-field">
      <label>{label} {required && <span>*</span>}</label>
      {renderInput()}
      {errors[name] && <span className="error">Campo obrigatório</span>}
    </div>
  );
}
```

---

## 🎯 Princípios Arquiteturais

### Backend

✅ **JSONB Pure** - Dados específicos em JSONB, dados compartilhados em colunas
✅ **Índices Parciais** - Performance equivalente a colunas normais
✅ **Type Safety** - Interfaces TypeScript para profileData
✅ **DDD** - Entities, Value Objects, Use Cases
✅ **Helpers no DTO** - Facilitar consumo no frontend

### Frontend

✅ **Component Composition** - Compor, não duplicar
✅ **Dynamic Forms** - Schema-driven, não hardcoded
✅ **Single Responsibility** - Cada componente faz uma coisa
✅ **DRY** - Reutilizar componentes
✅ **Open/Closed** - Nova persona = novo schema, não novo código

---

## 🚨 Anti-Patterns a Evitar

❌ **Backend:** Colunas com muitos NULLs (cnpj/cpf/company_name como colunas)
❌ **Backend:** Mega entity com campos opcionais para todas as personas
❌ **Frontend:** 4 formulários separados com código duplicado
❌ **Frontend:** Mega componente com `if (role === 'X')` em todo lugar
❌ **Frontend:** Carregar todos os layouts ao mesmo tempo (use lazy loading)

---

## 📚 Referências

- [TypeORM Migrations](https://typeorm.io/migrations)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [PostgreSQL GIN Indexes](https://www.postgresql.org/docs/current/gin.html)
- [React Hook Form](https://react-hook-form.com/)
- [Component Composition Pattern](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)

---

**Última atualização:** 2025-12-24
**Versão:** 1.0.0
