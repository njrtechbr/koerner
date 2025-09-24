# 📧 Checklist para Resolver Problema de Email

## ✅ Status Atual
- [x] SMTP Mandrill funcionando
- [x] Emails enviados com sucesso (3 testes)
- [x] Queue IDs obtidos
- [ ] Email chegando na caixa de entrada

## 🔍 O que verificar AGORA:

### 1. **Gmail - Caixa de SPAM** ⚠️
- Abrir Gmail
- Ir na pasta **SPAM/Lixeira**
- Procurar emails de: `noreply@koerner.com.br`, `contato@e-koerner.com.br`, `teste@koerner.com.br`

### 2. **Painel Mandrill** 📊
- Acessar: https://mandrillapp.com/activity
- Login com suas credenciais
- Verificar os Queue IDs:
  - `320D41C10A55`
  - `4D368874627`  
  - `61719874621`
- Ver status: **sent**, **delivered**, **bounced**, **rejected**

### 3. **Tempo de Entrega** ⏰
- Emails podem demorar até 5 minutos
- Aguardar um pouco mais

### 4. **Teste com outro email** 📧
- Tentar com email corporativo
- Ou outro provedor (hotmail, yahoo)

### 5. **Verificação de Domínio** 🔐
- No painel Mandrill, verificar se domínio `koerner.com.br` está verificado
- Se não estiver, pode estar sendo rejeitado por alguns provedores

## 🚨 Próximos Passos
1. Verificar SPAM primeiro
2. Acessar painel Mandrill
3. Se não funcionar, testar com outro email
4. Verificar configuração de domínio no Mandrill

## 📱 Contato
Se ainda não funcionar, podemos:
- Configurar SPF/DKIM records
- Usar email verificado do Mandrill
- Testar com API direta do Mandrill