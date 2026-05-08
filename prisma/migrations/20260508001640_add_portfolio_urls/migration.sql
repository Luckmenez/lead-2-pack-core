-- AlterTable
ALTER TABLE "fornecedores" ADD COLUMN     "portfolio_urls" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "profissionais" ADD COLUMN     "portfolio_urls" JSONB NOT NULL DEFAULT '[]';
