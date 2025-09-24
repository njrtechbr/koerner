// Script de diagnóstico para problemas de email
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function diagnosticarEmail() {
  console.log('🔍 DIAGNÓSTICO DE EMAIL MANDRILL');
  console.log('=' .repeat(50));
  
  // 1. Verificar variáveis de ambiente
  console.log('\n📋 1. VERIFICANDO VARIÁVEIS DE AMBIENTE:');
  console.log('MANDRILL_API_KEY:', process.env.MANDRILL_API_KEY ? '✅ Configurada' : '❌ Não encontrada');
  console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.mandrillapp.com');
  console.log('SMTP_PORT:', process.env.SMTP_PORT || '587');
  console.log('SMTP_USERNAME:', process.env.SMTP_USERNAME || 'E-Koerner');
  console.log('FROM_EMAIL:', process.env.OUVIDORIA_FROM_EMAIL || 'Não configurado');

  // 2. Testar conexão SMTP
  console.log('\n🔌 2. TESTANDO CONEXÃO SMTP:');
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mandrillapp.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME || 'E-Koerner',
      pass: process.env.MANDRILL_API_KEY,
    },
    debug: true, // Habilitar logs detalhados
    logger: true
  });

  try {
    await transporter.verify();
    console.log('✅ Conexão SMTP OK');
  } catch (error) {
    console.error('❌ Erro na conexão SMTP:', error.message);
    return;
  }

  // 3. Testar com diferentes configurações
  console.log('\n📤 3. TENTANDO ENVIOS COM DIFERENTES CONFIGURAÇÕES:');
  
  const testEmails = [
    {
      name: 'Teste 1 - Email Simples',
      options: {
        from: 'noreply@koerner.com.br',
        to: 'nnvljr86@gmail.com',
        subject: 'Teste 1 - Email Simples Koerner',
        text: 'Este é um teste simples de email do Koerner Tabelionato.',
        html: '<p>Este é um <strong>teste simples</strong> de email do Koerner Tabelionato.</p>'
      }
    },
    {
      name: 'Teste 2 - Com From Configurado',
      options: {
        from: process.env.OUVIDORIA_FROM_EMAIL || 'contato@e-koerner.com.br',
        to: 'nnvljr86@gmail.com',
        subject: 'Teste 2 - Com From Configurado',
        text: 'Teste com o email de origem configurado no .env.local',
        html: '<p>Teste com o <strong>email de origem configurado</strong> no .env.local</p>'
      }
    },
    {
      name: 'Teste 3 - Mandrill Headers',
      options: {
        from: 'teste@koerner.com.br',
        to: 'nnvljr86@gmail.com',
        subject: 'Teste 3 - Com Headers Mandrill',
        text: 'Teste com headers específicos do Mandrill',
        html: '<p>Teste com <strong>headers específicos</strong> do Mandrill</p>',
        headers: {
          'X-MC-Tags': 'teste,koerner',
          'X-MC-Track': 'opens,clicks'
        }
      }
    }
  ];

  for (const test of testEmails) {
    try {
      console.log(`\n📧 Enviando: ${test.name}`);
      const info = await transporter.sendMail(test.options);
      console.log(`✅ ${test.name} - Enviado!`);
      console.log(`   Message ID: ${info.messageId}`);
      console.log(`   Response: ${info.response}`);
    } catch (error) {
      console.error(`❌ ${test.name} - Erro:`, error.message);
      if (error.responseCode) {
        console.error(`   Código: ${error.responseCode}`);
      }
    }
  }

  // 4. Informações adicionais
  console.log('\n🔍 4. DICAS PARA SOLUÇÃO:');
  console.log('• Verifique a caixa de SPAM do Gmail');
  console.log('• Aguarde até 5 minutos para entrega');
  console.log('• Verifique se o domínio está verificado no Mandrill');
  console.log('• Teste com outro email de destino');
  console.log('• Acesse o painel Mandrill para logs: https://mandrillapp.com/activity');
  
  console.log('\n✅ Diagnóstico concluído!');
}

// Executar diagnóstico
diagnosticarEmail().catch(console.error);