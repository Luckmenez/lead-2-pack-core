import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class CreateCollaboratorsTable1735360000000 implements MigrationInterface {
  name = 'CreateCollaboratorsTable1735360000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enum para CollaboratorRole
    await queryRunner.query(
      `CREATE TYPE "public"."collaborator_role_enum" AS ENUM('ADMIN', 'SUPPORT', 'MODERATOR')`,
    );

    // Criar tabela collaborators
    await queryRunner.createTable(
      new Table({
        name: 'collaborators',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['ADMIN', 'SUPPORT', 'MODERATOR'],
            default: "'ADMIN'",
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'last_login',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
        indices: [
          {
            name: 'IDX_COLLABORATORS_EMAIL',
            columnNames: ['email'],
          },
          {
            name: 'IDX_COLLABORATORS_ROLE',
            columnNames: ['role'],
          },
          {
            name: 'IDX_COLLABORATORS_IS_ACTIVE',
            columnNames: ['is_active'],
          },
        ],
      }),
      true,
    );

    // Inserir collaborator admin padrão
    const defaultPassword = 'Admin@123'; // Deve ser trocada no primeiro login
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await queryRunner.query(
      `INSERT INTO collaborators (id, email, password, name, role, is_active)
       VALUES (
         gen_random_uuid(),
         'admin@lead2pack.com',
         '${hashedPassword}',
         'Administrator',
         'ADMIN',
         true
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('collaborators');
    await queryRunner.query(`DROP TYPE "public"."collaborator_role_enum"`);
  }
}
