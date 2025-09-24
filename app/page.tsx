export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Koerner Tabelionato de Notas e Protesto
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Acesse nossos formulários online
          </p>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <h2 className="text-xl font-semibold mb-3">Ouvidoria</h2>
              <p className="text-gray-600 mb-4">
                Canal para reclamações, denúncias, sugestões e elogios sobre nossos serviços.
              </p>
              <a 
                href="/ouvidoria" 
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Acessar Ouvidoria
              </a>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <h2 className="text-xl font-semibold mb-3">Trabalhe Conosco</h2>
              <p className="text-gray-600 mb-4">
                Envie seu currículo para nosso banco de talentos e faça parte da nossa equipe.
              </p>
              <a 
                href="/trabalhe-conosco" 
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Enviar Currículo
              </a>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <h2 className="text-xl font-semibold mb-3">LGPD - Encarregado</h2>
              <p className="text-gray-600 mb-4">
                Contato direto com o Encarregado de Proteção de Dados para exercer seus direitos.
              </p>
              <a 
                href="/lgpd/encarregado" 
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Contatar Encarregado
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-600">
          <p><strong>Koerner Tabelionato de Notas e Protesto</strong></p>
          <p>Rua José Cardoso de Lima, 1230, Centro<br/>Luís Eduardo Magalhães-BA – CEP: 47850-003</p>
          <p>Tel: (77) 3628-1979 / (77) 3022-2931</p>
          <p>Horário de Atendimento: Segunda à Sexta 08:00 - 16:00</p>
        </div>
      </div>
    </main>
  );
}