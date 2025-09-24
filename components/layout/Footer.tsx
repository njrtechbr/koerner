export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-4">
            © {new Date().getFullYear()} Koerner Tabelionato de Notas e Protesto
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://koerner.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              Site Principal
            </a>
            <a href="/lgpd/encarregado" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Proteção de Dados
            </a>
            <a href="/ouvidoria" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Ouvidoria
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}