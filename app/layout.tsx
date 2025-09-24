import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koerner Tabelionato - Formulários",
  description: "Formulários online do Koerner Tabelionato de Notas e Protesto",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}