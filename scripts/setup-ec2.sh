#!/bin/bash
# Script de setup inicial da EC2 (Ubuntu 22.04 LTS)
# Execute uma vez após criar a instância: bash setup-ec2.sh

set -e

echo "==> Atualizando pacotes..."
sudo apt update && sudo apt upgrade -y

echo "==> Instalando dependências..."
sudo apt install -y curl unzip nginx certbot python3-certbot-nginx

echo "==> Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
rm get-docker.sh

echo "==> Instalando AWS CLI v2..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
rm -rf awscliv2.zip aws/

echo "==> Habilitando nginx e docker no boot..."
sudo systemctl enable nginx
sudo systemctl enable docker

echo ""
echo "==> Setup concluído! Próximos passos:"
echo ""
echo "  1. Crie o arquivo .env.dev (ou .env.prod) em /home/ubuntu/"
echo "     com as variáveis DATABASE_URL, MAIL_*, JWT_SECRET, etc."
echo ""
echo "  2. Copie nginx/api.conf para /etc/nginx/sites-available/api"
echo "     e ajuste o server_name para o subdomínio correto:"
echo "     sudo cp nginx/api.conf /etc/nginx/sites-available/api"
echo "     sudo ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/"
echo "     sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "  3. Configure o SSL com Certbot:"
echo "     sudo certbot --nginx -d api.seudominio.com.br"
echo ""
echo "  4. Configure o IAM role na EC2 com permissão de ECR pull"
echo "     (ou use 'aws configure' com credenciais de um usuário IAM)"
echo ""
echo "  5. Faça push na branch develop/main para disparar o primeiro deploy."
