/*
  Warnings:

  - You are about to drop the column `cpf` on the `compradores` table. All the data in the column will be lost.
  - You are about to drop the column `email_comercial` on the `compradores` table. All the data in the column will be lost.
  - You are about to drop the column `email_pessoal` on the `compradores` table. All the data in the column will be lost.
  - You are about to drop the column `redeSocial` on the `compradores` table. All the data in the column will be lost.
  - You are about to drop the column `senha_hash` on the `compradores` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `compradores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `compradores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whatsapp_comercial` to the `compradores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whatsapp_pessoal` to the `compradores` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "compradores_cpf_key";

-- AlterTable
ALTER TABLE "compradores" DROP COLUMN "cpf",
DROP COLUMN "email_comercial",
DROP COLUMN "email_pessoal",
DROP COLUMN "redeSocial",
DROP COLUMN "senha_hash",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "rede_social" TEXT,
ADD COLUMN     "whatsapp_comercial" TEXT NOT NULL,
ADD COLUMN     "whatsapp_pessoal" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "fornecedores" ALTER COLUMN "cidade" DROP DEFAULT,
ALTER COLUMN "estado" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "compradores_email_key" ON "compradores"("email");
