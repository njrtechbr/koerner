// Script de teste para envio de email via Mandrill
// Execute: node test-email.js

const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmail() {
  console.log('🚀 Iniciando teste de email...');
  
  // Configuração do transportador Mandrill
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mandrillapp.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME || 'E-Koerner',
      pass: process.env.MANDRILL_API_KEY,
    },
  });

  // Verificar conexão
  try {
    console.log('🔌 Verificando conexão SMTP...');
    await transporter.verify();
    console.log('✅ Conexão SMTP estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro na conexão SMTP:', error);
    return;
  }

  // Configurações do email de teste
  const mailOptions = {
    from: process.env.OUVIDORIA_FROM_EMAIL || 'contato@e-koerner.com.br',
    to: 'nnvljr86@gmail.com',
    subject: '🧪 Teste de Email - Koerner Formulários',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">🎉 Teste de Envio Realizado com Sucesso!</h2>
        
        <p>Este é um email de teste do sistema de formulários do <strong>Koerner Tabelionato de Notas e Protesto</strong>.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #666; margin-top: 0;">📋 Informações do Teste:</h3>
          <ul style="color: #666;">
            <li><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</li>
            <li><strong>Servidor SMTP:</strong> ${process.env.SMTP_HOST}</li>
            <li><strong>Porta:</strong> ${process.env.SMTP_PORT}</li>
            <li><strong>Email de origem:</strong> ${process.env.OUVIDORIA_FROM_EMAIL}</li>
            <li><strong>Status:</strong> ✅ Funcionando</li>
          </ul>
        </div>
        
        <p>Os formulários disponíveis são:</p>
        <ul>
          <li>📝 <strong>Ouvidoria</strong> - Reclamações, denúncias, sugestões</li>
          <li>💼 <strong>Trabalhe Conosco</strong> - Envio de currículos</li>
          <li>🔒 <strong>LGPD</strong> - Contato com Encarregado de Dados</li>
        </ul>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        
        <div style="color: #666; font-size: 14px;">
          <p><strong>Koerner Tabelionato de Notas e Protesto</strong></p>
          <p>Rua José Cardoso de Lima, 1230, Centro<br/>
          Luís Eduardo Magalhães-BA – CEP: 47850-003</p>
          <p>Tel: (77) 3628-1979 / (77) 3022-2931</p>
        </div>
      </div>
    `,
  };

  // Enviar email
  try {
    console.log('📤 Enviando email de teste...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado com sucesso!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📨 Destinatário:', mailOptions.to);
    console.log('📬 Verifique sua caixa de entrada (e spam) em:', mailOptions.to);
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
  }
}

// Executar teste
testEmail().catch(console.error);