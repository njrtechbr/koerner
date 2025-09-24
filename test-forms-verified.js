// Teste dos formulários com domínio verificado
// Execute: node test-forms-verified.js

async function testOuvidoriaForm() {
  console.log('🧪 [TESTE] Testando formulário de ouvidoria...');
  
  const formData = new FormData();
  formData.append('nome', 'João Silva - Teste');
  formData.append('email', 'me@nereujr.com.br');
  formData.append('telefone', '(77) 99999-9999');
  formData.append('categoria', 'Sugestão');
  formData.append('anonimo', 'false');
  formData.append('mensagem', 'Esta é uma mensagem de teste do sistema de ouvidoria com domínio verificado.');

  try {
    console.log('📤 [TESTE] Enviando dados para API ouvidoria...');
    
    const response = await fetch('http://localhost:3002/api/ouvidoria', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    console.log('📊 [TESTE] Status:', response.status);
    console.log('📋 [TESTE] Resposta:', result);
    
    if (response.ok) {
      console.log('✅ [TESTE] Formulário enviado com sucesso!');
      console.log('📧 [TESTE] Verificar emails em me@nereujr.com.br');
    } else {
      console.error('❌ [TESTE] Erro no envio:', result.error);
    }
    
  } catch (error) {
    console.error('❌ [TESTE] Erro na requisição:', error.message);
  }
}

async function testTrabalheConoscoForm() {
  console.log('\n🧪 [TESTE] Testando formulário trabalhe conosco...');
  
  const formData = new FormData();
  formData.append('nome', 'Maria Santos - Teste');
  formData.append('email', 'me@nereujr.com.br');
  formData.append('telefone', '(77) 88888-8888');
  formData.append('area', 'Tecnologia');
  formData.append('pretensao', 'R$ 5.000,00');
  formData.append('mensagem', 'Candidatura de teste para verificar o sistema de emails.');
  
  // Criar um arquivo de teste
  const testFile = new Blob(['Conteúdo do currículo de teste'], { type: 'text/plain' });
  formData.append('cv', testFile, 'curriculo-teste.txt');

  try {
    console.log('📤 [TESTE] Enviando dados para API trabalhe-conosco...');
    
    const response = await fetch('http://localhost:3002/api/trabalhe-conosco', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    console.log('📊 [TESTE] Status:', response.status);
    console.log('📋 [TESTE] Resposta:', result);
    
    if (response.ok) {
      console.log('✅ [TESTE] Formulário enviado com sucesso!');
      console.log('📧 [TESTE] Verificar emails em me@nereujr.com.br');
    } else {
      console.error('❌ [TESTE] Erro no envio:', result.error);
    }
    
  } catch (error) {
    console.error('❌ [TESTE] Erro na requisição:', error.message);
  }
}

// Garantir que fetch e FormData estão disponíveis
if (typeof fetch === 'undefined') {
  const { fetch, FormData, Blob } = require('undici');
  global.fetch = fetch;
  global.FormData = FormData;
  global.Blob = Blob;
}

async function runTests() {
  await testOuvidoriaForm();
  await new Promise(resolve => setTimeout(resolve, 2000)); // Aguardar 2s entre testes  
  await testTrabalheConoscoForm();
}

runTests();