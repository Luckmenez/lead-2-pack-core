-- Normaliza e-mails existentes antes da constraint única
UPDATE "profissionais"
SET "email_pessoal" = LOWER(TRIM("email_pessoal"));

-- CreateIndex
CREATE UNIQUE INDEX "profissionais_email_pessoal_key" ON "profissionais"("email_pessoal");
