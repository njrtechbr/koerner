import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Header() {
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL;

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            {logoUrl ? (
              <div className="relative w-10 h-10">
                <Image
                  src={logoUrl}
                  alt="Koerner Tabelionato"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">K</span>
              </div>  
            )}
            <div>
              <h1 className="text-lg font-bold text-foreground">Portal de Formulários</h1>
            </div>
          </Link>
          
          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <a 
              href="https://koerner.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium text-sm"
            >
              Site Principal
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}