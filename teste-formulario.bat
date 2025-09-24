@echo off
echo 🧪 TESTE DE FORMULARIO VIA CURL
echo ==================================================

echo 📤 Enviando dados para API de ouvidoria...

curl -X POST http://localhost:3001/api/ouvidoria ^
  -F "tipo=Sugestão" ^
  -F "relato=Teste de formulário via curl - se chegou este email, os formulários estão funcionando!" ^
  -F "nome=Usuario Teste" ^
  -F "email=teste@exemplo.com" ^
  -F "telefone=11999999999" ^
  -F "anonimo=false" ^
  -F "retorno=email" ^
  -v

echo.
echo ✅ Teste concluído! Verifique o resultado acima.
echo 📬 Se status for 200 OK, verifique seu email em alguns minutos.

pause