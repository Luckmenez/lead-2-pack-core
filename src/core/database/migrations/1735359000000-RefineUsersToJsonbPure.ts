import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RefineUsersToJsonbPure1735359000000 implements MigrationInterface {
  name = 'RefineUsersToJsonbPure1735359000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Migrar dados de 'name' para profile_data (se não estiver lá ainda)
    // Para usuários que já tem profile_data mas não tem 'name' dentro dele
    await queryRunner.query(`
      UPDATE users
      SET profile_data = COALESCE(profile_data, '{}'::jsonb) || jsonb_build_object('displayName', name)
      WHERE name IS NOT NULL
    `);

    // 2. Remover a coluna 'name'
    await queryRunner.dropColumn('users', 'name');

    // 3. Criar índices parciais para queries otimizadas
    // Índice para CNPJ (CUSTOMER e SUPPLIER)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_users_cnpj" ON "users" ((profile_data->>'cnpj'))
      WHERE role IN ('CUSTOMER', 'SUPPLIER')
    `);

    // Índice para CPF (SECTOR_PROFESSIONAL)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_users_cpf" ON "users" ((profile_data->>'cpf'))
      WHERE role = 'SECTOR_PROFESSIONAL'
    `);

    // Índice para tradeName (busca por nome comercial)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_users_trade_name" ON "users" ((profile_data->>'tradeName'))
    `);

    // Índice para fullName (SECTOR_PROFESSIONAL)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_users_full_name" ON "users" ((profile_data->>'fullName'))
      WHERE role = 'SECTOR_PROFESSIONAL'
    `);

    // Índice para companyFullName (CUSTOMER e SUPPLIER)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_users_company_full_name" ON "users" ((profile_data->>'companyFullName'))
      WHERE role IN ('CUSTOMER', 'SUPPLIER')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices parciais
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_company_full_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_full_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_trade_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_cpf"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_cnpj"`);

    // Recriar coluna 'name'
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'name',
        type: 'varchar',
        isNullable: true,
      }),
    );

    // Restaurar dados de 'name' do profile_data
    await queryRunner.query(`
      UPDATE users
      SET name = profile_data->>'displayName'
      WHERE profile_data->>'displayName' IS NOT NULL
    `);
  }
}
