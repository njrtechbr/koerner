require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

console.log('🔧 TESTE COM EMAILS DIFERENTES - VERIFICAR QUAL FUNCIONA');
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
  debug: false // Menos verboso
});

// Lista de emails para testar
const emailsParaTestar = [
  'noreply@mandrillapp.com',        // Email padrão Mandrill
  'test@example.mandrillapp.com',   // Email de teste Mandrill
  'no-reply@mailchimp.com',         // Email Mailchimp
  'E-Koerner@users.noreply.github.com', // Baseado no username
  'admin@e-koerner.com.br',         // Variação do domínio
  'koerner@gmail.com'               // Gmail como teste
];

// Função para testar cada email
async function testarEmails() {
  console.log('📤 Testando diferentes endereços FROM...\n');
  
  for (let i = 0; i < emailsParaTestar.length; i++) {
    const fromEmail = emailsParaTestar[i];
    
    console.log(`${i + 1}. Testando: ${fromEmail}`);
    
    try {
      const mailOptions = {
        from: fromEmail,
        to: 'nnvljr86@gmail.com',
        subject: `Teste ${i + 1} - ${fromEmail}`,
        text: `Teste de email usando FROM: ${fromEmail}`,
        html: `
          <h3>Teste ${i + 1} - Email FROM Verificado</h3>
          <p><strong>FROM:</strong> ${fromEmail}</p>
          <p>Se você recebeu este email, este endereço FROM funciona!</p>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log(`   ✅ SUCESSO! Message ID: ${result.messageId}`);
      console.log(`   📋 Response: ${result.response}\n`);
      
    } catch (error) {
      console.log(`   ❌ ERRO: ${error.message}\n`);
    }
    
    // Pausa entre envios
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎯 CONCLUSÃO:');
  console.log('Verifique qual email chegou na sua caixa de entrada.');
  console.log('O email que funcionar será o que devemos usar no sistema.');
}

testarEmails();