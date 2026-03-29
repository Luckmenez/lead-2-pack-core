-- CreateTable
CREATE TABLE "profissionais" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "apelido" TEXT NOT NULL,
    "telefone_pessoal" TEXT NOT NULL,
    "whatsapp_pessoal" TEXT NOT NULL,
    "email_pessoal" TEXT NOT NULL,
    "website" TEXT,
    "rede_social" TEXT,
    "categorias_produtos" JSONB NOT NULL,
    "materiais" JSONB NOT NULL,
    "servicos" JSONB NOT NULL,
    "setores" JSONB NOT NULL,
    "descricao_institucional" TEXT NOT NULL,
    "forma_pagamento" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profissionais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profissionais_cpf_key" ON "profissionais"("cpf");
