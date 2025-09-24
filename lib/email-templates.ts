// Helper para gerar templates de email mais bonitos
export function createEmailTemplate(title: string, content: string, isConfirmation = false): string {
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || '';
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #334155;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
    }
    .header img {
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .header p {
      margin: 8px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content {
      padding: 32px 24px;
    }
    .section {
      margin-bottom: 24px;
    }
    .section h2 {
      color: #1e293b;
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 12px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }
    .field-group {
      display: grid;
      gap: 12px;
      margin-bottom: 16px;
    }
    .field {
      display: flex;
      align-items: start;
    }
    .field-label {
      font-weight: 600;
      color: #475569;
      min-width: 120px;
      margin-right: 12px;
    }
    .field-value {
      color: #334155;
      flex: 1;
    }
    .highlight {
      background-color: #f1f5f9;
      padding: 16px;
      border-radius: 6px;
      border-left: 4px solid #3b82f6;
    }
    .pre-text {
      background-color: #f8fafc;
      padding: 16px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      white-space: pre-wrap;
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 14px;
      line-height: 1.5;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      margin: 0;
      font-size: 14px;
      color: #64748b;
    }
    .footer a {
      color: #3b82f6;
      text-decoration: none;
    }
    .confirmation-badge {
      display: inline-block;
      background-color: #10b981;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${logoUrl ? `<img src="${logoUrl}" alt="Koerner Tabelionato" />` : ''}
      <h1>${title}</h1>
      ${isConfirmation ? '<p>Confirmação de Recebimento</p>' : '<p>Koerner Tabelionato de Notas e Protesto</p>'}
    </div>
    <div class="content">
      ${isConfirmation ? '<div class="confirmation-badge">✓ Recebido</div>' : ''}
      ${content}
    </div>
    <div class="footer">
      <p>
        <strong>Koerner Tabelionato de Notas e Protesto</strong><br/>
        Luís Eduardo Magalhães - BA<br/>
        ${isConfirmation ? '' : '<a href="https://koerner.com.br">koerner.com.br</a> | '}
        <a href="mailto:contato@koerner.com.br">contato@koerner.com.br</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export function createConfirmationContent(formType: 'ouvidoria' | 'trabalhe-conosco' | 'lgpd', userEmail: string, protocol?: string): string {
  const messages = {
    ouvidoria: {
      title: 'Manifestação de Ouvidoria',
      description: 'Sua manifestação foi recebida com sucesso e será analisada pela nossa equipe.',
      nextSteps: 'Entraremos em contato conforme sua preferência de retorno informada no formulário.'
    },
    'trabalhe-conosco': {
      title: 'Candidatura - Trabalhe Conosco',
      description: 'Seu currículo foi recebido com sucesso e será analisado pelo nosso time de RH.',
      nextSteps: 'Caso seu perfil seja compatível com nossas vagas disponíveis, entraremos em contato.'
    },
    lgpd: {
      title: 'Solicitação LGPD',
      description: 'Sua solicitação relacionada à proteção de dados foi recebida.',
      nextSteps: 'Analisaremos sua solicitação e responderemos dentro dos prazos legais estabelecidos pela LGPD.'
    }
  };

  const msg = messages[formType];
  
  return `
    <div class="section">
      <h2>Confirmação de Recebimento</h2>
      <div class="highlight">
        <p><strong>${msg.description}</strong></p>
        ${protocol ? `<p><strong>Protocolo:</strong> ${protocol}</p>` : ''}
        <p><strong>E-mail de contato:</strong> ${userEmail}</p>
        <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Bahia' })}</p>
      </div>
    </div>
    
    <div class="section">
      <h2>Próximos Passos</h2>
      <p>${msg.nextSteps}</p>
    </div>
    
    <div class="section">
      <h2>Importante</h2>
      <p>
        • Mantenha este e-mail como comprovante do envio<br/>
        • Caso necessite, entre em contato conosco referenciando os dados acima<br/>
        • Para dúvidas, utilize nossos canais oficiais de atendimento
      </p>
    </div>`;
}