// Teste da API Resend
// Execute: node test-resend.js

const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

async function testResendAPI() {
  console.log('🧪 [TESTE] Iniciando teste da API Resend...');
  
  const apiKey = process.env.RESEND_API_KEY;
  console.log('🔑 [TESTE] API Key configurada:', !!apiKey);
  
  if (!apiKey) {
    console.error('❌ [TESTE] RESEND_API_KEY não encontrada no .env.local');
    return;
  }

  const resend = new Resend(apiKey);

  try {
    console.log('📧 [TESTE] Enviando email de teste...');
    
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'nnvljr86@gmail.com',
      subject: 'Teste de Email - Portal Koerner',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">🧪 Teste de Email - Portal Koerner</h1>
          <p>Este é um email de teste do sistema de formulários.</p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0369a1; margin-top: 0;">📋 Informações do Teste:</h3>
            <ul>
              <li><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</li>
              <li><strong>Serviço:</strong> Resend API</li>
              <li><strong>API Key:</strong> ${apiKey.substring(0, 10)}...</li>
              <li><strong>Status:</strong> ✅ Funcionando</li>
            </ul>
          </div>
          
          <p>Se você recebeu este email, a integração com Resend está funcionando corretamente!</p>
        </div>
      `,
    });

    console.log('✅ [TESTE] Email enviado com sucesso!');
    console.log('📋 [TESTE] Resultado:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ [TESTE] Erro ao enviar email:', error);
    console.error('📋 [TESTE] Detalhes do erro:', error.message);
  }
}

testResendAPI();