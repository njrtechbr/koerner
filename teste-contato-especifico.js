require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

console.log('🔧 TESTE ESPECÍFICO: contato@e-koerner.com.br');
console.log('==================================================');

// Criar transporte SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.MANDRILL_API_KEY
  },
  debug: true // Debug completo para ver detalhes
});

// Configuração do email
const mailOptions = {
  from: 'contato@e-koerner.com.br',
  to: 'nnvljr86@gmail.com',
  subject: '🎯 Teste Específico - contato@e-koerner.com.br',
  text: 'Este é um teste específico do email contato@e-koerner.com.br para verificar se está funcionando.',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">🎯 Teste Específico</h2>
      <p><strong>FROM:</strong> contato@e-koerner.com.br</p>
      <p><strong>TO:</strong> nnvljr86@gmail.com</p>
      <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>✅ Se você recebeu este email:</h3>
        <p>O endereço <code>contato@e-koerner.com.br</code> está funcionando perfeitamente!</p>
      </div>
      
      <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>❌ Se você NÃO recebeu este email:</h3>
        <p>Precisamos verificar a configuração do domínio no Mandrill ou usar outro email.</p>
      </div>
      
      <hr style="margin: 30px 0;">
      <p style="font-size: 12px; color: #6b7280;">
        Koerner Tabelionato - Sistema de Formulários<br>
        Teste realizado em: ${new Date().toISOString()}
      </p>
    </div>
  `
};

// Enviar email
async function enviarTesteEspecifico() {
  try {
    console.log('📤 Enviando teste específico...');
    console.log(`FROM: contato@e-koerner.com.br`);
    console.log(`TO: nnvljr86@gmail.com\n`);
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ EMAIL ENVIADO PELO SMTP!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
    
    console.log('\n📋 INFORMAÇÕES IMPORTANTES:');
    console.log('- SMTP aceitou o email (Response 250)');
    console.log('- Agora aguarde 2-5 minutos para entrega');
    console.log('- Verifique caixa de entrada E spam');
    console.log('- Se não chegar, o domínio precisa ser verificado no Mandrill');
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    console.error('Detalhes:', error.message);
  }
}

enviarTesteEspecifico();