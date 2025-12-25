import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class UpdateUsersForPersonas1735358888000 implements MigrationInterface {
  name = 'UpdateUsersForPersonas1735358888000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."users_role_enum" ADD VALUE IF NOT EXISTS 'SECTOR_PROFESSIONAL'`,
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'profile_data',
        type: 'jsonb',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_users_profile_data" ON "users" USING GIN ("profile_data")`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'sectors',
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
            isUnique: true,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '500',
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

    await queryRunner.createTable(
      new Table({
        name: 'user_sectors',
        columns: [
          {
            name: 'userId',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'sectorId',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'user_sectors',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        name: 'FK_user_sectors_user',
      }),
    );

    await queryRunner.createForeignKey(
      'user_sectors',
      new TableForeignKey({
        columnNames: ['sectorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sectors',
        onDelete: 'CASCADE',
        name: 'FK_user_sectors_sector',
      }),
    );

    await queryRunner.query(`
      UPDATE users
      SET profile_data = jsonb_build_object('tradeName', "companyName")
      WHERE "companyName" IS NOT NULL
    `);

    await queryRunner.dropColumn('users', 'companyName');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'companyName',
        type: 'varchar',
        length: '200',
        isNullable: true,
      }),
    );

    await queryRunner.query(`
      UPDATE users
      SET "companyName" = profile_data->>'tradeName'
      WHERE profile_data IS NOT NULL
        AND profile_data->>'tradeName' IS NOT NULL
    `);

    await queryRunner.dropForeignKey('user_sectors', 'FK_user_sectors_sector');
    await queryRunner.dropForeignKey('user_sectors', 'FK_user_sectors_user');

    await queryRunner.dropTable('user_sectors');

    await queryRunner.dropTable('sectors');

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_profile_data"`);

    await queryRunner.dropColumn('users', 'profile_data');
  }
}
