-- CreateTable
CREATE TABLE "compradores" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "telefone_pessoal" TEXT NOT NULL,
    "email_pessoal" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "razao_social" TEXT NOT NULL,
    "nome_fantasia" TEXT,
    "website" TEXT,
    "redeSocial" TEXT,
    "email_comercial" TEXT NOT NULL,
    "telefone_comercial" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compradores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "compradores_cpf_key" ON "compradores"("cpf");
