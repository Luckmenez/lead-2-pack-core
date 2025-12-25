import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsersRoleEnum1735361000000 implements MigrationInterface {
  name = 'UpdateUsersRoleEnum1735361000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar se há usuários com role ADMIN
    const adminUsers = await queryRunner.query(`SELECT COUNT(*) as count FROM "users" WHERE "role" = 'ADMIN'`);

    if (adminUsers[0].count > 0) {
      throw new Error(`Cannot update enum: there are ${adminUsers[0].count} users with ADMIN role. Please migrate them to collaborators table first.`);
    }

    // Adicionar SECTOR_PROFESSIONAL ao enum (se ainda não existir)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'SECTOR_PROFESSIONAL' AND enumtypid = 'public.users_role_enum'::regtype) THEN
          ALTER TYPE "public"."users_role_enum" ADD VALUE 'SECTOR_PROFESSIONAL';
        END IF;
      END $$;
    `);

    // Tornar profile_data obrigatório (NOT NULL)
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "profile_data" SET NOT NULL
    `);

    // Nota: PostgreSQL não permite remover valores de enum diretamente.
    // O valor 'ADMIN' permanecerá no tipo enum mas não será usado.
    // Se quiser removê-lo completamente, seria necessário recriar o enum e a tabela.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter profile_data para nullable
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "profile_data" DROP NOT NULL
    `);

    // Nota: O valor 'ADMIN' já está no enum, então não precisa recriar
    // O valor 'SECTOR_PROFESSIONAL' também permanecerá
  }
}
