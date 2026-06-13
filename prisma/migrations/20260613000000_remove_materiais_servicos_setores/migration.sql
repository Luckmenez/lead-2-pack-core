-- Remove campos legados não utilizados (catálogo único em categorias_produtos)
ALTER TABLE "fornecedores" DROP COLUMN IF EXISTS "materiais";
ALTER TABLE "fornecedores" DROP COLUMN IF EXISTS "servicos";
ALTER TABLE "fornecedores" DROP COLUMN IF EXISTS "setores";

ALTER TABLE "profissionais" DROP COLUMN IF EXISTS "materiais";
ALTER TABLE "profissionais" DROP COLUMN IF EXISTS "servicos";
ALTER TABLE "profissionais" DROP COLUMN IF EXISTS "setores";
