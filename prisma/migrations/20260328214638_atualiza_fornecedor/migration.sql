/*
  Warnings:

  - You are about to drop the column `cpf` on the `fornecedores` table. All the data in the column will be lost.
  - You are about to drop the column `email_comercial` on the `fornecedores` table. All the data in the column will be lost.
  - You are about to drop the column `email_pessoal` on the `fornecedores` table. All the data in the column will be lost.
  - You are about to drop the column `nome_completo` on the `fornecedores` table. All the data in the column will be lost.
  - You are about to drop the column `redeSocial` on the `fornecedores` table. All the data in the column will be lost.
  - You are about to drop the column `telefone_comercial` on the `fornecedores` table. All the data in the column will be lost.
  - You are about to drop the column `telefone_pessoal` on the `fornecedores` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `fornecedores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `fornecedores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero_inscricao` to the `fornecedores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rede_social` to the `fornecedores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `fornecedores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_empresa` to the `fornecedores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_inscricao` to the `fornecedores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whatsapp` to the `fornecedores` table without a default value. This is not possible if the table is not empty.
  - Made the column `website` on table `fornecedores` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "fornecedores_cpf_key";

-- AlterTable
ALTER TABLE "fornecedores" DROP COLUMN "cpf",
DROP COLUMN "email_comercial",
DROP COLUMN "email_pessoal",
DROP COLUMN "nome_completo",
DROP COLUMN "redeSocial",
DROP COLUMN "telefone_comercial",
DROP COLUMN "telefone_pessoal",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "numero_inscricao" TEXT NOT NULL,
ADD COLUMN     "rede_social" TEXT NOT NULL,
ADD COLUMN     "telefone" TEXT NOT NULL,
ADD COLUMN     "tipo_empresa" TEXT NOT NULL,
ADD COLUMN     "tipo_inscricao" TEXT NOT NULL,
ADD COLUMN     "whatsapp" TEXT NOT NULL,
ALTER COLUMN "website" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "fornecedores_email_key" ON "fornecedores"("email");
