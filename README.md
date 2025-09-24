# Koerner Formulários

Sistema de formulários online para o Koerner Tabelionato de Notas e Protesto, desenvolvido com Next.js 15.

## Formulários Disponíveis

1. **Ouvidoria** (`/ouvidoria`) - Canal para reclamações, denúncias, sugestões e elogios
2. **Trabalhe Conosco** (`/trabalhe-conosco`) - Envio de currículos para banco de talentos
3. **LGPD - Encarregado** (`/lgpd/encarregado`) - Contato com o Encarregado de Proteção de Dados

## Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Nodemailer + Mandrill** - Serviço de envio de emails
- **Vercel** - Plataforma de deploy

## Configuração

### 1. Instalação

```bash
npm install
```

### 2. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local` e configure as variáveis:

```bash
cp .env.example .env.local
```

**Configurações obrigatórias:**

- `MANDRILL_API_KEY` - Chave da API do Mandrill (Mailchimp)
- `SMTP_HOST` - Servidor SMTP (smtp.mandrillapp.com)
- `SMTP_PORT` - Porta SMTP (587)
- `SMTP_USERNAME` - Usuário SMTP (E-Koerner)
- `OUVIDORIA_TO_EMAIL` - Email de destino para ouvidoria
- `RH_TO_EMAIL` - Email de destino para currículos
- `DPO_TO_EMAIL` - Email de destino para LGPD

**Emails de origem (opcionais):**

- `OUVIDORIA_FROM_EMAIL` - Email de origem da ouvidoria
- `RH_FROM_EMAIL` - Email de origem do RH
- `DPO_FROM_EMAIL` - Email de origem do DPO

### 3. Desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000

### 4. Build

```bash
npm run build
npm start
```

## Deploy na Vercel

### 1. Conecte seu repositório GitHub à Vercel

### 2. Configure as variáveis de ambiente no painel da Vercel:

**Environment Variables:**
- `MANDRILL_API_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `OUVIDORIA_FROM_EMAIL`
- `OUVIDORIA_TO_EMAIL`
- `RH_FROM_EMAIL`
- `RH_TO_EMAIL`
- `DPO_FROM_EMAIL`
- `DPO_TO_EMAIL`

### 3. Deploy automático

A Vercel fará o deploy automaticamente a cada push na branch principal.

## Estrutura do Projeto

```
app/
├── page.tsx                    # Página inicial
├── layout.tsx                  # Layout raiz
├── globals.css                 # Estilos globais
├── ouvidoria/
│   └── page.tsx               # Formulário de Ouvidoria
├── trabalhe-conosco/
│   └── page.tsx               # Formulário Trabalhe Conosco
├── lgpd/
│   └── encarregado/
│       └── page.tsx           # Formulário LGPD
└── api/
    ├── ouvidoria/
    │   └── route.ts           # API da Ouvidoria
    ├── trabalhe-conosco/
    │   └── route.ts           # API do Trabalhe Conosco
    └── lgpd/
        └── encarregado/
            └── route.ts       # API do LGPD
```

## Funcionalidades

### Segurança
- Honeypot anti-bot
- Validação de formulários
- Sanitização de nomes de arquivos
- Headers de segurança

### Upload de Arquivos
- **Ouvidoria**: PDF, JPG, PNG (até 5 arquivos, 5MB cada)
- **Trabalhe Conosco**: PDF, DOC, DOCX, ODT (1 arquivo, até 10MB)
- **LGPD**: PDF, JPG, PNG, DOC, DOCX, ODT (até 5 arquivos, 5MB cada)

### Email
- Diferentes destinatários por formulário
- Templates HTML responsivos
- Anexos com sanitização de nomes
- Reply-to com email do remetente

### Conformidade
- LGPD
- Provimento CNJ nº 149/2023
- Política de Privacidade integrada

## Licença

Este projeto é de propriedade do Koerner Tabelionato de Notas e Protesto.

## Suporte

Para suporte técnico, entre em contato através dos canais oficiais do Koerner Tabelionato.