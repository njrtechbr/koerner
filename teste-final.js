require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

console.log('🔧 TESTE COM EMAIL CORRETO');
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
  debug: true
});

// Configuração do email com FROM correto
const mailOptions = {
  from: process.env.FROM_EMAIL, // Agora usando contato@e-koerner.com.br
  to: 'nnvljr86@gmail.com',
  subject: '✅ Teste Final - Email Corrigido',
  text: 'Este email está sendo enviado com o endereço FROM correto: contato@e-koerner.com.br',
  html: `
    <h2>✅ Teste Final - Email Corrigido</h2>
    <p>Este email está sendo enviado com o endereço FROM correto:</p>
    <p><strong>contato@e-koerner.com.br</strong></p>
    <p>Se você recebeu este email, o problema foi resolvido!</p>
    <hr>
    <p><small>Koerner Tabelionato - Sistema de Formulários</small></p>
  `
};

// Enviar email
async function enviarTeste() {
  try {
    console.log('📤 Enviando email com FROM correto...');
    console.log(`FROM: ${process.env.FROM_EMAIL}`);
    console.log(`TO: nnvljr86@gmail.com`);
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ EMAIL ENVIADO COM SUCESSO!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
    
    console.log('\n🎯 AGORA DEVE FUNCIONAR!');
    console.log('Verifique seu email em alguns minutos.');
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    console.error('Detalhes:', error.message);
  }
}

enviarTeste();