#!/bin/bash
# Script de instalação e configuração do projeto

echo "🚀 Configurando projeto Koerner Formulários..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Verificar se o arquivo .env.local existe
if [ ! -f ".env.local" ]; then
    echo "⚙️ Criando arquivo .env.local..."
    cp .env.example .env.local
    echo "✅ Arquivo .env.local criado! Configure as variáveis de ambiente."
else
    echo "✅ Arquivo .env.local já existe."
fi

echo ""
echo "🎉 Projeto configurado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis no arquivo .env.local"
echo "2. Obtenha uma chave da API do Resend em: https://resend.com"
echo "3. Execute 'npm run dev' para iniciar o desenvolvimento"
echo ""
echo "📁 Estrutura criada:"
echo "- /ouvidoria - Formulário de Ouvidoria"
echo "- /trabalhe-conosco - Formulário de RH"
echo "- /lgpd/encarregado - Formulário de LGPD"
echo ""
echo "🌐 Deploy na Vercel:"
echo "1. Conecte seu repositório à Vercel"
echo "2. Configure as variáveis de ambiente no painel"
echo "3. Deploy automático a cada push!"