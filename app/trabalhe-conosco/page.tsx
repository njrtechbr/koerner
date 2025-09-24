"use client";
import React, { useState } from "react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import FileUpload from "@/components/ui/FileUpload";

const areaOptions = [
  { value: "", label: "Selecione uma área..." },
  { value: "Atendimento", label: "Atendimento" },
  { value: "Notas/Escrituras", label: "Notas/Escrituras" },
  { value: "Protesto", label: "Protesto" },
  { value: "Administrativo/Financeiro", label: "Administrativo/Financeiro" },
  { value: "TI", label: "Tecnologia da Informação" },
  { value: "Outro", label: "Outro" },
];

// Helper: deterministic protocol generator (Trabalhe Conosco)
function generateProtocolTC(date: Date = new Date(), randomFn: () => number = Math.random): string {
  const year = date.getFullYear();
  const rand = Math.floor(randomFn() * 999999).toString().padStart(6, "0");
  return `KOTC-${year}-${rand}`; // Koerner Ofertas/Trabalhe Conosco
}

export default function TrabalheConoscoPage(): JSX.Element {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [showPolicy, setShowPolicy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    setErr(null);
    setProtocol(null);

    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);

    const nome = (fd.get("nome") as string) || "";
    const email = (fd.get("email") as string) || "";
    const cvFiles = fd.getAll("cv");

    if (!nome.trim()) {
      setErr("Informe seu nome completo.");
      setSubmitting(false);
      return;
    }
    if (!email.trim()) {
      setErr("Informe um e‑mail válido.");
      setSubmitting(false);
      return;
    }
    // client checks for CV: required 1 file up to 10MB
    if (cvFiles.length === 0 || !(cvFiles[0] instanceof File) || (cvFiles[0] as File).size === 0) {
      setErr("Anexe seu currículo em PDF/DOC (até 10MB).");
      setSubmitting(false);
      return;
    }
    if ((cvFiles[0] as File).size > 10 * 1024 * 1024) {
      setErr("Arquivo de currículo excede 10MB.");
      setSubmitting(false);
      return;
    }

    try {
      const r = await fetch("/api/trabalhe-conosco", {
        method: "POST",
        body: fd,
      });
      let data: any = {};
      try {
        data = await r.json();
      } catch {/* ignore */}
      if (!r.ok) throw new Error(data?.error || "Falha ao enviar");

      // Armazenar dados do formulário para mostrar no recibo
      const dadosFormulario: Record<string, any> = {};
      for (const [key, value] of fd.entries()) {
        if (key !== 'website' && key !== 'cv' && value) {
          dadosFormulario[key] = value;
        }
      }
      
      // Armazenar no sessionStorage para a página de recibo
      if (data.protocolo) {
        sessionStorage.setItem(`recibo-${data.protocolo}`, JSON.stringify(dadosFormulario));
        
        // Redirecionar para página de recibo
        window.location.href = `/recibo/trabalhe-conosco?protocolo=${data.protocolo}&data=${data.data}`;
        return;
      }

      // protocolo local (pode ser substituído por backend)
      const proto = generateProtocolTC();
      setProtocol(proto);
      setOk("Currículo enviado com sucesso.");
      form.reset();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Erro inesperado";
      setErr(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              Carreiras
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Trabalhe Conosco
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Faça parte da nossa equipe! Envie seu currículo e junte-se ao 
              <span className="font-semibold text-primary"> Koerner Tabelionato</span> — 
              onde tradição e inovação se encontram.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao início
            </Link>
            <a href="https://www.koerner.com.br" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors">
              Visitar koerner.com.br
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Info Card */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-card-foreground mb-3">Como funciona</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Preencha seus dados pessoais e profissionais, selecione a área de interesse e 
                  <strong className="text-card-foreground"> anexe seu currículo</strong> (PDF/DOC até 10MB). 
                  Nosso time de RH analisará seu perfil e, caso haja compatibilidade com nossas vagas, 
                  entraremos em contato para os próximos passos do processo seletivo.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-2">Envie seu currículo</h2>
              <p className="text-muted-foreground">Preencha os dados abaixo e anexe seu currículo para fazer parte da nossa equipe.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Anti-bot honeypot */}
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              {/* Dados Pessoais */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Dados Pessoais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    name="nome"
                    label="Nome completo"
                    placeholder="Seu nome completo"
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    label="E-mail"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    name="telefone"
                    label="Telefone (opcional)"
                    placeholder="(77) 99999-9999"
                  />
                  <Input
                    type="url"
                    name="linkedin"
                    label="LinkedIn (opcional)"
                    placeholder="https://www.linkedin.com/in/seu-perfil"
                  />
                </div>
              </div>

              {/* Informações Profissionais */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Informações Profissionais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    name="area"
                    label="Área de interesse"
                    options={areaOptions}
                    placeholder="Selecione uma área..."
                  />
                  <Input
                    name="pretensao"
                    label="Pretensão salarial (opcional)"
                    placeholder="Ex: R$ 3.000,00"
                  />
                </div>

                <Textarea
                  name="mensagem"
                  label="Mensagem (opcional)"
                  placeholder="Conte-nos sobre sua experiência, disponibilidade, objetivos profissionais..."
                  rows={5}
                />
              </div>

              {/* Currículo */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Documentos</h3>
                
                <FileUpload
                  name="cv"
                  label="Currículo"
                  accept=".pdf,.doc,.docx,.odt"
                  maxSizeMB={10}
                  acceptedTypes={['PDF', 'DOC', 'DOCX', 'ODT']}
                  helperText="Arquivo único, máximo 10MB"
                  required
                />
              </div>

              {/* LGPD */}
              <div className="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <input 
                  id="lgpd" 
                  type="checkbox" 
                  name="lgpd" 
                  required 
                  className="w-4 h-4 text-primary rounded focus:ring-primary mt-1" 
                />
                <label htmlFor="lgpd" className="text-sm text-foreground">
                  Li e aceito a{' '}
                  <button 
                    type="button" 
                    onClick={() => setShowPolicy(true)} 
                    className="text-primary underline hover:text-primary/80"
                  >
                    política de privacidade
                  </button>{' '}
                  e autorizo o uso dos dados para fins de recrutamento e seleção.
                </label>
              </div>

              {/* Messages */}
              {err && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-destructive">{err}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {ok && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">{ok}</p>
                      {protocol && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Protocolo: <span className="font-semibold">{protocol}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                <Button 
                  type="reset" 
                  variant="outline" 
                  className="sm:w-auto"
                >
                  Limpar Formulário
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="sm:w-auto sm:ml-auto"
                  size="lg"
                >
                  {submitting ? 'Enviando...' : 'Enviar Currículo'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPolicy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-card-foreground">Política de Privacidade</h3>
              <button
                onClick={() => setShowPolicy(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-muted-foreground space-y-4">
              <p>
                <strong>COLETA E TRATAMENTO:</strong> Os dados e documentos enviados serão utilizados exclusivamente para análise de perfil profissional, contato e etapas de seleção, em conformidade com a LGPD e atos normativos aplicáveis.
              </p>
              <p>
                <strong>COMPARTILHAMENTO:</strong> Poderá haver compartilhamento com provedores de tecnologia contratados e autoridades quando exigido por lei, sempre limitado ao mínimo necessário.
              </p>
              <p>
                <strong>ARMAZENAMENTO E SEGURANÇA:</strong> Os dados são armazenados com medidas técnicas e administrativas adequadas. Você pode solicitar atualização ou correção dos seus dados pelos nossos canais.
              </p>
              <p>
                <strong>CONTATO DO ENCARREGADO:</strong>{' '}
                <a className="text-primary underline" href="mailto:abrante.marques@koerner.com.br">
                  abrante.marques@koerner.com.br
                </a>{' '}
                | (77) 3628-1979.
              </p>
              <p className="text-xs text-muted-foreground/70">Versão resumida. Para a íntegra da política, consulte a página institucional.</p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowPolicy(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}