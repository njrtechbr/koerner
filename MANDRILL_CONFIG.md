# Configuração Mandrill (Mailchimp) - Koerner Formulários

## ✅ Configurações Atualizadas

O projeto foi migrado do **Resend** para o **Mandrill (Mailchimp)** com as seguintes configurações:

### 📧 Credenciais Mandrill

```bash
# Configurações no .env.local
MANDRILL_API_KEY=md-Ycs3KLyKlK5oK-_eoDCpFA
SMTP_HOST=smtp.mandrillapp.com
SMTP_PORT=587
SMTP_USERNAME=E-Koerner
```

### 📨 Emails de Destino Configurados

```bash
OUVIDORIA_TO_EMAIL=anapaula@koerner.com.br
RH_TO_EMAIL=rh@koerner.com.br
DPO_TO_EMAIL=abrante.marques@koerner.com.br
```

### 🔧 Alterações Técnicas Realizadas

1. **Dependências:**
   - ❌ Removido: `resend`
   - ✅ Adicionado: `nodemailer` + `@types/nodemailer`

2. **Configuração de Email (`lib/email.ts`):**
   - Criado transportador Nodemailer para Mandrill
   - Função `sendEmail()` para envio
   - Função `verifyConnection()` para teste

3. **APIs Atualizadas:**
   - `/api/ouvidoria/route.ts` - Migrado para Nodemailer
   - `/api/trabalhe-conosco/route.ts` - Migrado para Nodemailer
   - `/api/lgpd/encarregado/route.ts` - Migrado para Nodemailer

4. **Configuração Vercel:**
   - `vercel.json` atualizado com novas variáveis de ambiente

### 🚀 Status do Projeto

- ✅ **Servidor funcionando**: http://localhost:3000
- ✅ **Todas as rotas operacionais**
- ✅ **Configuração Mandrill completa**
- ✅ **Pronto para deploy na Vercel**

### 📋 Para Deploy na Vercel

Configure as seguintes variáveis de ambiente no painel da Vercel:

```
MANDRILL_API_KEY=md-Ycs3KLyKlK5oK-_eoDCpFA
SMTP_HOST=smtp.mandrillapp.com
SMTP_PORT=587
SMTP_USERNAME=E-Koerner
OUVIDORIA_FROM_EMAIL=ouvidoria@koerner.com.br
OUVIDORIA_TO_EMAIL=anapaula@koerner.com.br
RH_FROM_EMAIL=rh@koerner.com.br
RH_TO_EMAIL=rh@koerner.com.br
DPO_FROM_EMAIL=lgpd@koerner.com.br
DPO_TO_EMAIL=abrante.marques@koerner.com.br
```

### 🧪 Como Testar

1. **Acesse os formulários:**
   - http://localhost:3000/ouvidoria
   - http://localhost:3000/trabalhe-conosco
   - http://localhost:3000/lgpd/encarregado

2. **Preencha e envie** um formulário de teste

3. **Verifique o email** no destinatário configurado

### 📖 Documentação Mandrill

- **Painel**: https://mandrillapp.com
- **API Docs**: https://mandrillapp.com/api/docs/
- **SMTP Settings**: https://mandrillapp.com/settings/sending-domains

### 🔐 Segurança

- ✅ Chave API armazenada em variável de ambiente
- ✅ Validação honeypot anti-spam
- ✅ Sanitização de anexos
- ✅ Limitação de upload de arquivos

---

**Projeto 100% funcional com Mandrill! 🎉**