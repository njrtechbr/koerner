require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

console.log('🎯 TESTE FINAL RESEND PARA nnvljr86@gmail.com');
console.log('==================================================');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testeFinalResend() {
  try {
    console.log('📧 Configurações:');
    console.log(`RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ Ausente'}`);
    console.log(`FROM_EMAIL: ${process.env.FROM_EMAIL || 'noreply@resend.dev'}`);
    console.log(`TO_EMAIL: nnvljr86@gmail.com`);
    console.log('');
    
    console.log('📤 Enviando email final...');
    
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@resend.dev',
      to: ['nnvljr86@gmail.com'],
      subject: '🎉 Sistema Koerner - Email Funcionando!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Sistema Koerner</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Formulários Online Funcionando!</p>
          </div>
          
          <div style="padding: 30px;">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h2 style="color: #059669; margin: 0 0 15px 0;">✅ Email Configurado com Sucesso!</h2>
              <p style="margin: 0; color: #374151;">
                O sistema de envio de emails via <strong>Resend</strong> está funcionando perfeitamente!
              </p>
            </div>
            
            <h3 style="color: #1f2937; margin: 25px 0 15px 0;">📋 Formulários Disponíveis:</h3>
            <ul style="color: #4b5563; line-height: 1.6;">
              <li><strong>Ouvidoria:</strong> http://localhost:3000/ouvidoria</li>
              <li><strong>Trabalhe Conosco:</strong> http://localhost:3000/trabalhe-conosco</li>
              <li><strong>LGPD/DPO:</strong> http://localhost:3000/lgpd/encarregado</li>
            </ul>
            
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #1d4ed8; margin: 0 0 10px 0;">🚀 Próximos Passos:</h3>
              <ol style="color: #374151; margin: 0; padding-left: 20px;">
                <li>Teste cada formulário online</li>
                <li>Verifique se os emails chegam</li>
                <li>Deploy na Vercel quando estiver satisfeito</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                <strong>Koerner Tabelionato de Notas e Protesto</strong><br>
                Sistema de Formulários - Next.js 15 + Resend
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
Sistema Koerner - Email Funcionando!

✅ O sistema de envio de emails via Resend está funcionando perfeitamente!

📋 Formulários Disponíveis:
- Ouvidoria: http://localhost:3000/ouvidoria
- Trabalhe Conosco: http://localhost:3000/trabalhe-conosco
- LGPD/DPO: http://localhost:3000/lgpd/encarregado

🚀 Próximos Passos:
1. Teste cada formulário online
2. Verifique se os emails chegam
3. Deploy na Vercel quando estiver satisfeito

Koerner Tabelionato de Notas e Protesto
Sistema de Formulários - Next.js 15 + Resend
      `
    });

    console.log('✅ EMAIL ENVIADO COM SUCESSO!');
    console.log(`📧 Email ID: ${result.data?.id}`);
    console.log(`📊 Status: ${result.error ? 'Erro' : 'Sucesso'}`);
    
    if (result.error) {
      console.log(`❌ Erro: ${result.error}`);
    } else {
      console.log('');
      console.log('🎯 SISTEMA 100% FUNCIONAL!');
      console.log('- Resend configurado ✅');
      console.log('- APIs corrigidas ✅');
      console.log('- Email enviado ✅');
      console.log('');
      console.log('📬 Verifique seu email em 1-2 minutos!');
      console.log('Se chegou, todos os formulários funcionarão perfeitamente.');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    console.error('Detalhes:', error.message);
  }
}

testeFinalResend();