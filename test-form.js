// Teste do formulário de ouvidoria
// Execute: node test-form.js

async function testOuvidoriaForm() {
  console.log('🧪 [TESTE] Testando formulário de ouvidoria...');
  
  const formData = new FormData();
  formData.append('nome', 'João Silva');
  formData.append('email', 'nnvljr86@gmail.com');
  formData.append('telefone', '(77) 99999-9999');
  formData.append('categoria', 'Sugestão');
  formData.append('anonimo', 'false');
  formData.append('mensagem', 'Esta é uma mensagem de teste do sistema de ouvidoria.');

  try {
    console.log('📤 [TESTE] Enviando dados para API...');
    
    const response = await fetch('http://localhost:3002/api/ouvidoria', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    console.log('📊 [TESTE] Status:', response.status);
    console.log('📋 [TESTE] Resposta:', result);
    
    if (response.ok) {
      console.log('✅ [TESTE] Formulário enviado com sucesso!');
      console.log('📧 [TESTE] Verifique o email nnvljr86@gmail.com para confirmar o recebimento');
    } else {
      console.error('❌ [TESTE] Erro no envio:', result.error);
    }
    
  } catch (error) {
    console.error('❌ [TESTE] Erro na requisição:', error.message);
  }
}

// Garantir que fetch está disponível no Node.js
if (typeof fetch === 'undefined') {
  const { fetch } = require('undici');
  global.fetch = fetch;
}

testOuvidoriaForm();