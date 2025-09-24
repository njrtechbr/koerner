import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/layout/Layout";

export default function HomePage() {
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL;

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-background py-12 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {logoUrl && (
              <div className="relative w-16 h-16 mx-auto mb-6">
                <Image
                  src={logoUrl}
                  alt="Koerner Tabelionato"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Portal de Formulários
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Acesse os formulários digitais do Koerner Tabelionato
            </p>
            <a 
              href="https://koerner.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Visitar site principal
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Forms Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Formulários Disponíveis
            </h2>
            <p className="text-muted-foreground">
              Selecione o formulário que deseja preencher
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Ouvidoria */}
            <Link href="/ouvidoria" className="group block">
              <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <svg className="w-6 h-6 text-primary group-hover:text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7m0 10h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">Ouvidoria</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Reclamações, sugestões, elogios e denúncias
                </p>
                <div className="flex items-center text-primary text-sm font-medium group-hover:text-primary/80">
                  Acessar formulário
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Trabalhe Conosco */}
            <Link href="/trabalhe-conosco" className="group block">
              <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <svg className="w-6 h-6 text-primary group-hover:text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">Trabalhe Conosco</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Envie seu currículo e faça parte da nossa equipe
                </p>
                <div className="flex items-center text-primary text-sm font-medium group-hover:text-primary/80">
                  Enviar currículo
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* LGPD */}
            <Link href="/lgpd/encarregado" className="group block">
              <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <svg className="w-6 h-6 text-primary group-hover:text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">LGPD</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Encarregado de Proteção de Dados
                </p>
                <div className="flex items-center text-primary text-sm font-medium group-hover:text-primary/80">
                  Exercer direitos
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}