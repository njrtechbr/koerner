const { sendEmail } = require('./lib/email.ts');

// Teste direto da função de email
async function testeEmailDireto() {
  console.log('🧪 TESTE DIRETO DA FUNÇÃO sendEmail');
  console.log('==================================================');
  
  try {
    const resultado = await sendEmail({
      from: 'noreply@resend.dev',
      to: 'nnvljr86@gmail.com',
      subject: '🧪 Teste Direto - Formulário Simulado',
      html: `
        <h2>🧪 Teste Direto da Função sendEmail</h2>
        <p>Este email foi enviado diretamente da função sendEmail, simulando um formulário.</p>
        <p><strong>Dados do formulário simulado:</strong></p>
        <ul>
          <li>Nome: Teste Usuario</li>
          <li>Email: teste@exemplo.com</li>
          <li>Tipo: Sugestão</li>
          <li>Relato: Teste de formulário</li>
        </ul>
        <p>Se você recebeu este email, a função sendEmail está funcionando!</p>
      `,
      text: 'Teste direto da função sendEmail - Se você recebeu este email, a função está funcionando!'
    });
    
    console.log('✅ RESULTADO:', resultado);
    
  } catch (error) {
    console.error('❌ ERRO:', error);
  }
}

testeEmailDireto();