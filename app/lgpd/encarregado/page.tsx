"use client";
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import FileUpload from "@/components/ui/FileUpload";

const tipoSolicitacaoOptions = [
  "Confirmação da existência de tratamento de dados",
  "Acesso aos dados pessoais",
  "Correção de dados incompletos, inexatos ou desatualizados",
  "Informação sobre compartilhamento de dados",
  "Outra (especificar abaixo)",
];

export default function EncarregadoLGPDPage(): JSX.Element {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    setErr(null);

    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);

    // validations
    const nome = (fd.get("nome") as string) || "";
    const email = (fd.get("email") as string) || "";
    const tipo = (fd.get("tipo") as string) || "";
    const descricao = (fd.get("descricao") as string) || "";

    if (!nome.trim()) {
      setErr("Informe seu nome completo.");
      setSubmitting(false);
      return;
    }
    if (!email.trim()) {
      setErr("Informe um e‑mail para contato.");
      setSubmitting(false);
      return;
    }
    if (!tipo) {
      setErr("Selecione o tipo de solicitação.");
      setSubmitting(false);
      return;
    }
    if (!descricao.trim()) {
      setErr("Descreva sua solicitação.");
      setSubmitting(false);
      return;
    }

    try {
      const r = await fetch("/api/lgpd/encarregado", {
        method: "POST",
        body: fd,
      });
      let data: any = {};
      try { data = await r.json(); } catch { /* ignore */ }
      if (!r.ok) throw new Error(data?.error || "Falha ao enviar");
      
      // Armazenar dados do formulário para mostrar no recibo
      const dadosFormulario: Record<string, any> = {};
      for (const [key, value] of fd.entries()) {
        if (key !== 'website' && key !== 'anexos' && value) {
          dadosFormulario[key] = value;
        }
      }
      
      // Armazenar no sessionStorage para a página de recibo
      if (data.protocolo) {
        sessionStorage.setItem(`recibo-${data.protocolo}`, JSON.stringify(dadosFormulario));
        
        // Redirecionar para página de recibo
        window.location.href = `/recibo/lgpd?protocolo=${data.protocolo}&data=${data.data}`;
        return;
      }
      
      setOk("Solicitação enviada com sucesso. Em breve entraremos em contato dentro dos prazos legais.");
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              LGPD
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Encarregado de Proteção de Dados
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Em conformidade com o <span className="font-semibold text-primary">Provimento CNJ nº 149/2023</span> e com a 
              <span className="font-semibold text-primary"> Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)</span>, 
              disponibilizamos este canal para que você possa exercer seus direitos relacionados aos dados pessoais.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="/" className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao início
            </a>
            <a href="https://www.koerner.com.br" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors">
              Visitar koerner.com.br
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-2 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Solicitação LGPD
              </h2>
              <p className="text-muted-foreground">Preencha o formulário abaixo para exercer seus direitos relacionados à proteção de dados pessoais.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Anti-bot honeypot */}
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              {/* Dados de Contato */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Dados de Contato</h3>
                
                <Input
                  name="nome"
                  label="Nome completo"
                  placeholder="Seu nome completo"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    type="email"
                    name="email"
                    label="E-mail para contato"
                    placeholder="seu@email.com"
                    required
                  />
                  <Input
                    name="telefone"
                    label="Telefone (opcional)"
                    placeholder="(77) 99999-9999"
                  />
                </div>
              </div>

              {/* Tipo de Solicitação */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Tipo de Solicitação</h3>
                
                <fieldset className="space-y-4">
                  <legend className="text-sm font-medium text-foreground mb-4">
                    Selecione o tipo de solicitação <span className="text-destructive">*</span>
                  </legend>
                  <div className="space-y-3">
                    {tipoSolicitacaoOptions.map((label, idx) => (
                      <label key={idx} className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <input 
                          type="radio" 
                          name="tipo" 
                          value={label} 
                          className="w-4 h-4 text-primary focus:ring-primary mt-1" 
                          required 
                        />
                        <span className="text-sm text-foreground leading-relaxed">{label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Descrição */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Detalhes da Solicitação</h3>
                
                <Textarea
                  name="descricao"
                  label="Descrição da solicitação"
                  placeholder="Descreva detalhadamente sua solicitação relacionada a dados pessoais. Inclua informações como período, tipo de dados, finalidade, etc."
                  rows={6}
                  required
                />
              </div>

              {/* Anexos */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Documentos (Opcional)</h3>
                
                <FileUpload
                  name="anexos"
                  label="Anexar documentos"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.odt"
                  maxSizeMB={5}
                  acceptedTypes={['PDF', 'JPG', 'PNG', 'DOC', 'DOCX', 'ODT']}
                  helperText="Até 5 arquivos, máximo 5MB cada"
                />
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
                  {submitting ? 'Enviando...' : 'Enviar Solicitação'}
                </Button>
              </div>
            </form>
          </div>

          {/* Legal Notice */}
          <div className="mt-8 p-6 bg-muted/50 rounded-xl border border-border">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Informações Legais</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  As informações prestadas neste formulário serão utilizadas exclusivamente para o atendimento da sua solicitação relacionada ao tratamento de dados pessoais, conforme previsto na LGPD e no Provimento CNJ nº 149/2023. Sua manifestação será analisada com a devida atenção e respondida dentro dos prazos legais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}