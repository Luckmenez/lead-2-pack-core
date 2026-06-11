-- AlterTable
ALTER TABLE "profissionais" ADD COLUMN "tipo_empresa" TEXT NOT NULL DEFAULT 'mei';

ALTER TABLE "profissionais" ALTER COLUMN "tipo_empresa" DROP DEFAULT;
