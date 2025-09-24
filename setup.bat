@echo off
echo 🚀 Configurando projeto Koerner Formularios...

echo 📦 Instalando dependencias...
call npm install

if not exist ".env.local" (
    echo ⚙️ Criando arquivo .env.local...
    copy .env.example .env.local
    echo ✅ Arquivo .env.local criado! Configure as variaveis de ambiente.
) else (
    echo ✅ Arquivo .env.local ja existe.
)

echo.
echo 🎉 Projeto configurado com sucesso!
echo.
echo 📋 Proximos passos:
echo 1. Configure as variaveis no arquivo .env.local
echo 2. Obtenha uma chave da API do Resend em: https://resend.com
echo 3. Execute 'npm run dev' para iniciar o desenvolvimento
echo.
echo 📁 Estrutura criada:
echo - /ouvidoria - Formulario de Ouvidoria
echo - /trabalhe-conosco - Formulario de RH
echo - /lgpd/encarregado - Formulario de LGPD
echo.
echo 🌐 Deploy na Vercel:
echo 1. Conecte seu repositorio a Vercel
echo 2. Configure as variaveis de ambiente no painel
echo 3. Deploy automatico a cada push!

pause