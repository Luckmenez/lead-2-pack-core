import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1766367630608 implements MigrationInterface {
  name = 'CreateUsersTable1766367630608';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('CUSTOMER', 'SUPPLIER', 'ADMIN')`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
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
            name: 'role',
            type: 'enum',
            enum: ['CUSTOMER', 'SUPPLIER', 'ADMIN'],
            default: "'CUSTOMER'",
            isNullable: false,
          },
          {
            name: 'companyName',
            type: 'varchar',
            length: '200',
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
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
