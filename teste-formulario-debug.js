require('dotenv').config({ path: '.env.local' });

console.log('🔍 TESTE DE DEBUG - FORMULÁRIO OUVIDORIA');
console.log('==================================================');

console.log('📋 Variáveis de Ambiente:');
console.log(`RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ Ausente'}`);
console.log(`OUVIDORIA_TO_EMAIL: ${process.env.OUVIDORIA_TO_EMAIL || '❌ Não configurada'}`);
console.log(`OUVIDORIA_FROM_EMAIL: ${process.env.OUVIDORIA_FROM_EMAIL || '❌ Não configurada'}`);
console.log(`FROM_EMAIL: ${process.env.FROM_EMAIL || '❌ Não configurada'}`);
console.log('');

// Simular envio do formulário de ouvidoria
async function testarFormularioOuvidoria() {
  try {
    console.log('📤 Simulando envio do formulário de ouvidoria...');
    
    const formData = new FormData();
    formData.append('tipo', 'Sugestão');
    formData.append('relato', 'Teste de formulário de ouvidoria via script');
    formData.append('nome', 'Teste Usuario');
    formData.append('email', 'teste@exemplo.com');
    formData.append('telefone', '11999999999');
    formData.append('anonimo', 'false');
    formData.append('retorno', 'email');
    
    const response = await fetch('http://localhost:3001/api/ouvidoria', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    console.log(`📊 Status HTTP: ${response.status}`);
    console.log(`📋 Resposta:`, result);
    
    if (response.ok && result.ok) {
      console.log('✅ FORMULÁRIO ENVIADO COM SUCESSO!');
      console.log('📬 Verifique se o email chegou no destino.');
    } else {
      console.log('❌ ERRO NO FORMULÁRIO:', result.error || 'Erro desconhecido');
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
    console.log('\n🔍 Possíveis causas:');
    console.log('- Servidor Next.js não está rodando');
    console.log('- Porta 3000 não está disponível');
    console.log('- Problema na API route');
  }
}

testarFormularioOuvidoria();