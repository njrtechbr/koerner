// Teste com domínio verificado e-koerner.com.br
// Execute: node test-verified-domain.js

const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

async function testVerifiedEmails() {
  console.log('🧪 [TESTE] Testando com domínio verificado e-koerner.com.br...');
  
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ [TESTE] RESEND_API_KEY não encontrada');
    return;
  }

  const resend = new Resend(apiKey);

  try {
    console.log('📤 [TESTE] Enviando de contato@e-koerner.com.br para me@nereujr.com.br...');
    
    const result = await resend.emails.send({
      from: 'contato@e-koerner.com.br',
      to: 'me@nereujr.com.br',
      subject: '🎉 Teste - Domínio Verificado!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">🎉 Parabéns!</h1>
            <h2 style="color: #374151;">Domínio e-koerner.com.br Verificado</h2>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
            <h3 style="color: #1e40af; margin-top: 0;">✅ Teste Realizado com Sucesso!</h3>
            <p>O sistema de emails do Portal Koerner está funcionando perfeitamente:</p>
            <ul style="color: #374151;">
              <li><strong>De:</strong> contato@e-koerner.com.br</li>
              <li><strong>Para:</strong> me@nereujr.com.br</li>
              <li><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</li>
              <li><strong>Status:</strong> ✅ Enviado com sucesso</li>
            </ul>
          </div>
          
          <div style="margin: 30px 0;">
            <h3 style="color: #374151;">📋 Formulários Disponíveis:</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 15px;">
              <div style="background: #fef3c7; padding: 15px; border-radius: 6px; flex: 1; min-width: 200px;">
                <h4 style="color: #92400e; margin: 0 0 10px 0;">📝 Ouvidoria</h4>
                <p style="color: #78350f; margin: 0; font-size: 14px;">Reclamações, denúncias e sugestões</p>
              </div>
              <div style="background: #dbeafe; padding: 15px; border-radius: 6px; flex: 1; min-width: 200px;">
                <h4 style="color: #1e40af; margin: 0 0 10px 0;">💼 Trabalhe Conosco</h4>
                <p style="color: #1e3a8a; margin: 0; font-size: 14px;">Envio de currículos e candidaturas</p>
              </div>
              <div style="background: #f3e8ff; padding: 15px; border-radius: 6px; flex: 1; min-width: 200px;">
                <h4 style="color: #7c3aed; margin: 0 0 10px 0;">🔒 LGPD</h4>
                <p style="color: #6b21a8; margin: 0; font-size: 14px;">Contato com Encarregado de Dados</p>
              </div>
            </div>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <div style="color: #6b7280; font-size: 14px; line-height: 1.5;">
            <p><strong>Koerner Tabelionato de Notas e Protesto</strong></p>
            <p>Rua José Cardoso de Lima, 1230, Centro<br/>
            Luís Eduardo Magalhães-BA – CEP: 47850-003</p>
            <p>Tel: (77) 3628-1979 / (77) 3022-2931</p>
            <p>Email: contato@e-koerner.com.br</p>
          </div>
        </div>
      `,
    });

    if (result.error) {
      console.error('❌ [TESTE] Erro no envio:', result.error);
    } else {
      console.log('✅ [TESTE] Email enviado com sucesso!');
      console.log('📧 [TESTE] Message ID:', result.data?.id);
      console.log('📬 [TESTE] Verifique o email me@nereujr.com.br');
    }
    
  } catch (error) {
    console.error('❌ [TESTE] Exceção:', error.message);
  }
}

testVerifiedEmails();