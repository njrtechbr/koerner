// Script de teste para verificar o envio de emails
const { sendEmail } = require('./lib/email');

async function testEmail() {
  console.log('🧪 Testando envio de email...');
  
  try {
    // Verificar se as variáveis de ambiente estão carregadas
    console.log('🔑 RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Configurada' : 'NÃO CONFIGURADA');
    console.log('📧 OUVIDORIA_TO_EMAIL:', process.env.OUVIDORIA_TO_EMAIL || 'NÃO CONFIGURADA');
    
    const result = await sendEmail({
      from: 'noreply@resend.dev',
      to: 'nnvljr86@gmail.com',
      subject: 'Teste - Sistema de Formulários Koerner',
      html: `
        <h2>🧪 Email de Teste</h2>
        <p>Este é um email de teste do sistema de formulários do Koerner Tabelionato.</p>
        <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        <p>Se você recebeu este email, o sistema está funcionando corretamente!</p>
      `,
    });
    
    console.log('✅ Email enviado com sucesso!');
    console.log('📨 ID da mensagem:', result.messageId);
    console.log('📋 Resposta completa:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    
    if (error.message) {
      console.error('💬 Mensagem do erro:', error.message);
    }
    
    if (error.response) {
      console.error('📡 Resposta da API:', error.response);
    }
  }
}

testEmail();