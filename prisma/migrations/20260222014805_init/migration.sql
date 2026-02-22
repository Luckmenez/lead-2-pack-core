-- CreateTable
CREATE TABLE "fornecedores" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "telefone_pessoal" TEXT NOT NULL,
    "email_pessoal" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "razao_social" TEXT NOT NULL,
    "nome_fantasia" TEXT NOT NULL,
    "website" TEXT,
    "redeSocial" TEXT,
    "email_comercial" TEXT NOT NULL,
    "telefone_comercial" TEXT NOT NULL,
    "categorias_produtos" JSONB NOT NULL,
    "materiais" JSONB NOT NULL,
    "servicos" JSONB NOT NULL,
    "setores" JSONB NOT NULL,
    "descricao_institucional" TEXT NOT NULL,
    "forma_pagamento" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fornecedores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fornecedores_cpf_key" ON "fornecedores"("cpf");
