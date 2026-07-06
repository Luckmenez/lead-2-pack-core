ALTER TABLE "planos" ADD COLUMN "limite_produtos" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "collaborators" ALTER COLUMN "senha_hash" DROP NOT NULL;
ALTER TABLE "collaborators" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'suporte';
ALTER TABLE "collaborators" ADD COLUMN "invite_token" TEXT;
ALTER TABLE "collaborators" ADD COLUMN "invite_accepted_at" TIMESTAMP(3);

CREATE UNIQUE INDEX "collaborators_invite_token_key" ON "collaborators"("invite_token");
