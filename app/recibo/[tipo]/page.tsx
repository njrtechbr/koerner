'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Recibo from '@/components/Recibo';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

function ReciboContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const tipo = params.tipo as string;
  const protocolo = searchParams.get('protocolo');
  const data = searchParams.get('data');
  
  // Verificar se o tipo é válido
  const tiposValidos = ['ouvidoria', 'trabalhe-conosco', 'lgpd'];
  if (!tiposValidos.includes(tipo)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Tipo de formulário inválido
              </h1>
              <p className="text-gray-600 mb-6">
                O tipo de formulário informado não é válido.
              </p>
              <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Voltar ao Início
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Verificar se o protocolo foi informado
  if (!protocolo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Protocolo não encontrado
              </h1>
              <p className="text-gray-600 mb-6">
                Não foi possível localizar o protocolo. Verifique se acessou o link corretamente.
              </p>
              <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Voltar ao Início
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Recuperar dados dos parâmetros da URL e sessionStorage
  let dadosFormulario = {};
  
  // Primeiro, pegar dados dos searchParams
  const urlParams = Object.fromEntries(searchParams.entries());
  delete urlParams.protocolo; // Remover protocolo dos dados
  delete urlParams.data; // Remover data dos dados
  
  // Adicionar dados da URL
  dadosFormulario = { ...urlParams };
  
  // Tentar recuperar dados adicionais do sessionStorage se disponível
  if (typeof window !== 'undefined') {
    try {
      const dadosArmazenados = sessionStorage.getItem(`recibo-${protocolo}`);
      if (dadosArmazenados) {
        const dadosSession = JSON.parse(dadosArmazenados);
        dadosFormulario = { ...dadosFormulario, ...dadosSession };
        // Limpar dados após uso para não ocupar espaço
        sessionStorage.removeItem(`recibo-${protocolo}`);
      }
    } catch (error) {
      console.warn('Erro ao recuperar dados do sessionStorage:', error);
    }
  }
  
  console.log('Dados do formulário:', dadosFormulario); // Debug

  const reciboData = {
    protocolo,
    tipo: tipo as 'ouvidoria' | 'trabalhe-conosco' | 'lgpd',
    data: data || new Date().toISOString(),
    dados: dadosFormulario
  };

  return <Recibo data={reciboData} />;
}

export default function ReciboPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando recibo...</p>
        </div>
      </div>
    }>
      <ReciboContent />
    </Suspense>
  );
}