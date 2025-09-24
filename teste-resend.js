require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

console.log('🔧 TESTE COM RESEND');
console.log('==================================================');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testarResend() {
  try {
    console.log('📤 Enviando email via Resend...');
    console.log(`API Key: ${process.env.RESEND_API_KEY ? 'Configurada ✅' : 'Não encontrada ❌'}`);
    
    const result = await resend.emails.send({
      from: 'noreply@resend.dev', // Email padrão do Resend
      to: ['nnvljr86@gmail.com'],
      subject: '🎉 Teste Resend - Koerner Tabelionato',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">🎉 Teste Resend Funcionando!</h2>
          
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3>✅ Email via Resend</h3>
            <p><strong>FROM:</strong> noreply@resend.dev</p>
            <p><strong>TO:</strong> nnvljr86@gmail.com</p>
            <p><strong>Serviço:</strong> Resend API</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          </div>
          
          <p>Se você recebeu este email, o <strong>Resend está funcionando perfeitamente</strong>!</p>
          
          <p>Agora todos os formulários do sistema Koerner funcionarão corretamente:</p>
          <ul>
            <li>📋 Formulário de Ouvidoria</li>
            <li>💼 Formulário Trabalhe Conosco</li>
            <li>🔒 Formulário LGPD/DPO</li>
          </ul>
          
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #6b7280;">
            Koerner Tabelionato - Sistema de Formulários<br>
            Powered by Resend + Next.js 15
          </p>
        </div>
      `,
      text: 'Teste Resend - Se você recebeu este email, o Resend está funcionando!'
    });

    console.log('✅ EMAIL ENVIADO COM SUCESSO!');
    console.log('Email ID:', result.data?.id);
    console.log('Response:', result);
    
    console.log('\n🎯 PRÓXIMOS PASSOS:');
    console.log('1. Aguarde 1-2 minutos (Resend é mais rápido)');
    console.log('2. Verifique sua caixa de entrada');
    console.log('3. Se chegou, está tudo funcionando!');
    
  } catch (error) {
    console.error('❌ Erro ao enviar via Resend:', error);
    console.error('Detalhes:', error.message);
  }
}

testarResend();