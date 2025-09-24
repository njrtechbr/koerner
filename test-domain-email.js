// Teste de email após verificação do domínio
// Execute: node test-domain-email.js

const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

async function testVerifiedDomain() {
  console.log('🧪 [TESTE] Testando emails com domínio verificado...');
  
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ [TESTE] RESEND_API_KEY não encontrada');
    return;
  }

  const resend = new Resend(apiKey);

  // Lista de emails para testar
  const testEmails = [
    {
      from: 'ouvidoria@koerner.com.br',
      to: 'matheus.silva@koerner.com.br',
      subject: 'Teste - Ouvidoria Koerner',
    },
    {
      from: 'rh@koerner.com.br', 
      to: 'rh@koerner.com.br',
      subject: 'Teste - RH Koerner',
    },
    {
      from: 'lgpd@koerner.com.br',
      to: 'lgpd@koerner.com.br', 
      subject: 'Teste - LGPD Koerner',
    }
  ];

  for (const email of testEmails) {
    try {
      console.log(`📤 [TESTE] Enviando de ${email.from} para ${email.to}...`);
      
      const result = await resend.emails.send({
        from: email.from,
        to: email.to,
        subject: email.subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>✅ Teste de Domínio Verificado</h1>
            <p>Parabéns! O domínio <strong>koerner.com.br</strong> foi verificado com sucesso.</p>
            <p>Agora você pode enviar emails para qualquer endereço usando este domínio.</p>
            <hr>
            <p><small>Teste realizado em: ${new Date().toLocaleString('pt-BR')}</small></p>
          </div>
        `,
      });

      if (result.error) {
        console.error(`❌ [TESTE] Erro em ${email.from}:`, result.error);
      } else {
        console.log(`✅ [TESTE] Sucesso! Message ID: ${result.data?.id}`);
      }
      
    } catch (error) {
      console.error(`❌ [TESTE] Exceção em ${email.from}:`, error.message);
    }
  }
}

testVerifiedDomain();