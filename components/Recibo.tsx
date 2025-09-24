'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from '@/components/ui/Button';
import { CheckCircle, Printer, Download, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

interface ReciboData {
  protocolo: string;
  tipo: 'ouvidoria' | 'trabalhe-conosco' | 'lgpd';
  data: string;
  dados: Record<string, any>;
}

interface ReciboProps {
  data: ReciboData;
}

const tipoLabels = {
  ouvidoria: 'Ouvidoria',
  'trabalhe-conosco': 'Trabalhe Conosco',
  lgpd: 'LGPD - Proteção de Dados'
};

const tipoDescricoes = {
  ouvidoria: 'Sua manifestação foi recebida e será analisada por nossa equipe.',
  'trabalhe-conosco': 'Seu currículo foi recebido e será analisado por nosso RH.',
  lgpd: 'Sua solicitação foi recebida e será tratada pelo Encarregado de Dados.'
};

export default function Recibo({ data }: ReciboProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const handleDownload = () => {
    // Implementar download como PDF usando window.print() com configuração específica
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const printContent = document.querySelector('.print-area')?.innerHTML || '';
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Recibo - ${data.protocolo}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #000;
              background: white;
              padding: 20px;
            }
            
            .print-header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            
            .print-header h1 {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            
            .print-header p {
              font-size: 11px;
              margin: 2px 0;
            }
            
            .print-protocolo {
              text-align: center;
              background: #f8f9fa;
              border: 2px solid #007bff;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
            }
            
            .print-protocolo h3 {
              font-size: 14px;
              margin-bottom: 8px;
            }
            
            .print-protocolo p {
              font-size: 28px;
              font-weight: bold;
              font-family: monospace;
              color: #007bff;
              letter-spacing: 2px;
            }
            
            .print-grid {
              display: flex;
              flex-wrap: wrap;
              gap: 15px;
              margin: 20px 0;
            }
            
            .print-item {
              flex: 1 1 45%;
              background: #f8f9fa;
              border: 1px solid #ddd;
              border-radius: 6px;
              padding: 10px;
            }
            
            .print-item dt {
              font-weight: bold;
              font-size: 10px;
              text-transform: uppercase;
              color: #666;
              margin-bottom: 4px;
            }
            
            .print-item dd {
              font-size: 12px;
              color: #333;
              word-wrap: break-word;
            }
            
            .print-section {
              margin: 20px 0;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 6px;
            }
            
            .print-section h3 {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #333;
            }
            
            .print-warning {
              background: #fff3cd;
              border: 2px solid #ffc107;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
            }
            
            .print-warning h3 {
              font-size: 13px;
              font-weight: bold;
              margin-bottom: 8px;
              color: #856404;
            }
            
            .print-warning ul {
              margin: 0;
              padding-left: 20px;
            }
            
            .print-warning li {
              font-size: 11px;
              line-height: 1.4;
              margin-bottom: 4px;
              color: #856404;
            }
            
            .print-footer {
              text-align: center;
              border-top: 1px solid #ddd;
              padding-top: 15px;
              margin-top: 20px;
              font-size: 10px;
              color: #666;
            }
            
            @media print {
              @page {
                margin: 1cm;
                size: A4;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return format(data, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return dataString;
    }
  };

  const formatarLabel = (key: string) => {
    const labels: Record<string, string> = {
      nome: 'Nome',
      email: 'E-mail',
      telefone: 'Telefone',
      cpf: 'CPF',
      tipo: 'Tipo',
      categoria: 'Categoria',
      relato: 'Relato',
      mensagem: 'Mensagem',
      descricao: 'Descrição',
      area: 'Área de Interesse',
      pretensao: 'Pretensão Salarial',
      protocolo: 'Protocolo Anterior',
      data_ocorrido: 'Data do Ocorrido',
      envolvidos: 'Pessoas Envolvidas'
    };
    
    return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <>
      {/* Estilos para impressão */}
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 12px !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          .print-area, .print-area * {
            visibility: visible;
          }
          
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            font-size: 12px !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          /* Ajustes para caber em uma página */
          .print-header {
            margin-bottom: 15px !important;
            padding-bottom: 10px !important;
          }
          
          .print-header h1 {
            font-size: 18px !important;
            margin-bottom: 5px !important;
          }
          
          .print-header p {
            font-size: 11px !important;
            margin: 2px 0 !important;
          }
          
          .print-protocolo {
            font-size: 24px !important;
            padding: 10px !important;
            margin: 10px 0 !important;
          }
          
          .print-section {
            margin-bottom: 15px !important;
            padding: 8px !important;
          }
          
          .print-section h3 {
            font-size: 14px !important;
            margin-bottom: 8px !important;
          }
          
          .print-grid {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 10px !important;
          }
          
          .print-item {
            flex: 1 1 45% !important;
            min-width: 45% !important;
            padding: 6px !important;
            margin-bottom: 5px !important;
          }
          
          .print-item dt {
            font-size: 10px !important;
            margin-bottom: 2px !important;
          }
          
          .print-item dd {
            font-size: 11px !important;
            line-height: 1.2 !important;
          }
          
          .print-footer {
            margin-top: 15px !important;
            padding-top: 10px !important;
            font-size: 10px !important;
          }
          
          .print-warning {
            padding: 8px !important;
            margin: 10px 0 !important;
          }
          
          .print-warning h3 {
            font-size: 12px !important;
            margin-bottom: 5px !important;
          }
          
          .print-warning ul {
            margin: 0 !important;
            padding-left: 15px !important;
          }
          
          .print-warning li {
            font-size: 10px !important;
            line-height: 1.3 !important;
            margin-bottom: 2px !important;
          }
          
          @page {
            margin: 1cm;
            size: A4;
          }
        }
        
        .print-only {
          display: none;
        }
      `}</style>

      {/* Background 100% branco */}
      <div className="min-h-screen bg-white py-8" style={{ background: '#ffffff' }}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Ações (não imprimir) */}
          <div className="no-print mb-6 flex flex-wrap gap-4 justify-between">
            <Link href="/">
              <Button variant="outline" className="gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Início
              </Button>
            </Link>
            
            <div className="flex gap-2">
              <Button 
                onClick={handlePrint} 
                disabled={isPrinting}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Printer className="w-4 h-4" />
                {isPrinting ? 'Imprimindo...' : 'Imprimir'}
              </Button>
              <Button 
                onClick={handleDownload} 
                variant="outline"
                className="gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Baixar PDF
              </Button>
            </div>
          </div>

          {/* Área de impressão - 100% Branca */}
          <div className="print-area bg-white" style={{ background: '#ffffff' }}>
            {/* Cabeçalho */}
            <div className="print-header mb-8 text-center border-b-2 border-gray-200 pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FileText className="w-10 h-10 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Koerner Tabelionato de Notas e Protesto
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                Rua José Cardoso de Lima, 1230, Centro - Luís Eduardo Magalhães-BA
              </p>
              <p className="text-gray-600">CEP: 47850-003 | Tel: (77) 3628-1979 / (77) 3022-2931</p>
            </div>

            {/* Documento principal */}
            <div className="bg-white border-2 border-gray-300 rounded-lg" style={{ background: '#ffffff' }}>
              {/* Header do recibo */}
              <div className="bg-gray-100 border-b-2 border-gray-300 p-6 text-center" style={{ background: '#f8f9fa' }}>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <h2 className="text-3xl font-bold text-gray-900">RECIBO DE PROTOCOLO</h2>
                </div>
                <p className="text-xl text-gray-700 font-medium">
                  {tipoLabels[data.tipo]} - Enviado com Sucesso
                </p>
              </div>

              {/* Conteúdo */}
              <div className="p-8 bg-white" style={{ background: '#ffffff' }}>
                {/* Protocolo em destaque */}
                <div className="print-protocolo text-center mb-8 p-6 bg-gray-50 border-2 border-blue-200 rounded-lg" style={{ background: '#f8f9fa' }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">NÚMERO DO PROTOCOLO</h3>
                  <p className="text-4xl font-mono font-bold text-blue-600 tracking-wider">
                    {data.protocolo}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Guarde este número para acompanhamento
                  </p>
                </div>

                {/* Informações em duas colunas */}
                <div className="print-grid grid md:grid-cols-2 gap-8 mb-8">
                  {/* Data */}
                  <div className="print-item bg-gray-50 p-6 rounded-lg border border-gray-200" style={{ background: '#f8f9fa' }}>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">📅 Data de Envio</h3>
                    <p className="text-gray-800 text-lg">
                      {formatarData(data.data)}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="print-item bg-green-50 p-6 rounded-lg border border-green-200" style={{ background: '#f0fdf4' }}>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">✅ Status</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-green-700 text-lg">RECEBIDO</span>
                    </div>
                    <p className="text-gray-700">
                      {tipoDescricoes[data.tipo]}
                    </p>
                  </div>
                </div>

                {/* Dados informados - só exibe se houver dados */}
                {(() => {
                  const dadosFiltrados = Object.entries(data.dados)
                    .filter(([key, value]) => value && value !== '' && key !== 'lgpd' && key !== 'anonimo' && key !== 'website');
                  
                  console.log('Dados filtrados:', dadosFiltrados); // Debug
                  
                  if (dadosFiltrados.length === 0) {
                    return null; // Não exibe a seção se não há dados
                  }
                  
                  return (
                    <div className="print-section border-t-2 border-gray-200 pt-8">
                      <h3 className="font-bold text-gray-900 mb-6 text-xl">📋 Dados Informados</h3>
                      <div className="print-grid grid md:grid-cols-2 gap-4">
                        {dadosFiltrados.map(([key, value]) => (
                          <div key={key} className="print-item bg-gray-50 p-4 rounded-lg border border-gray-200" style={{ background: '#f8f9fa' }}>
                            <dt className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1">
                              {formatarLabel(key)}
                            </dt>
                            <dd className="text-gray-800">
                              {typeof value === 'string' && value.length > 150 
                                ? `${value.substring(0, 150)}...`
                                : String(value)}
                            </dd>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Informações importantes */}
                <div className="border-t-2 border-gray-200 pt-8 mt-8">
                  <div className="print-warning bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6" style={{ background: '#fefce8' }}>
                    <h3 className="font-bold text-gray-900 mb-4 text-xl">⚠️ Informações Importantes</h3>
                    <ul className="space-y-2 text-gray-800">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 font-bold">•</span>
                        <span>Guarde este protocolo para acompanhar sua solicitação</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 font-bold">•</span>
                        <span>Você receberá um email de confirmação no endereço informado</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 font-bold">•</span>
                        <span>O prazo de resposta varia conforme o tipo de solicitação</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 font-bold">•</span>
                        <span>Em caso de dúvidas, entre em contato informando o protocolo</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Rodapé */}
                <div className="print-footer mt-8 pt-6 border-t-2 border-gray-200 text-center text-gray-600">
                  <p className="mb-2">
                    <strong>Este documento foi gerado automaticamente em:</strong>
                  </p>
                  <p className="text-lg font-mono">
                    {formatarData(new Date().toISOString())}
                  </p>
                  <p className="mt-4 font-medium">
                    Koerner Tabelionato de Notas e Protesto - Portal de Formulários
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}