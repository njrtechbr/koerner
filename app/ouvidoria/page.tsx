"use client";
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import FileUpload from "@/components/ui/FileUpload";

const tipoOptions = [
  { value: "", label: "Selecione o tipo..." },
  { value: "Reclamação", label: "Reclamação" },
  { value: "Denúncia", label: "Denúncia" },
  { value: "Sugestão", label: "Sugestão" },
  { value: "Elogio", label: "Elogio" },
  { value: "Dúvida", label: "Dúvida" },
  { value: "Outro", label: "Outro" },
];

const retornoOptions = [
  { value: "email", label: "E-mail" },
  { value: "telefone", label: "Telefone" },
  { value: "nenhum", label: "Não desejo retorno" },
];

export default function OuvidoriaPage(): JSX.Element {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [anonimo, setAnonimo] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    setErr(null);

    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);

    if (!anonimo) {
      const email = (fd.get("email") as string) || "";
      const telefone = (fd.get("telefone") as string) || "";
      if (!email && !telefone) {
        setErr("Informe e‑mail ou telefone para retorno (ou marque Anônimo).");
        setSubmitting(false);
        return;
      }
    }

    try {
      const r = await fetch("/api/ouvidoria", {
        method: "POST",
        body: fd,
      });
      let data: any = {};
      try {
        data = await r.json();
      } catch {
        // ignore
      }
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
        window.location.href = `/recibo/ouvidoria?protocolo=${data.protocolo}&data=${data.data}`;
        return;
      }
      
      setOk("Manifestação enviada com sucesso. Você receberá um protocolo por e‑mail (se informado).");
      form.reset();
      setAnonimo(false);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Erro inesperado";
      setErr(message);
    } finally {
      setSubmitting(false);
    }
  }

  const tipoOptions = [
    { value: "Reclamação", label: "Reclamação" },
    { value: "Denúncia", label: "Denúncia" },
    { value: "Sugestão", label: "Sugestão" },
    { value: "Elogio", label: "Elogio" },
    { value: "Dúvida", label: "Dúvida" },
    { value: "Outro", label: "Outro" }
  ];

  const retornoOptions = [
    { value: "email", label: "E-mail" },
    { value: "telefone", label: "Telefone" },
    { value: "nenhum", label: "Não desejo retorno" }
  ];

  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              <span className="text-primary">Ouvidoria</span> Koerner
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Canal direto para suas manifestações. Sua opinião é fundamental para melhorarmos nossos serviços.
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-border">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-card-foreground mb-2">O que é a Ouvidoria?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Ouvidoria é o canal institucional para você registrar <strong>reclamações, denúncias, sugestões, elogios e dúvidas</strong> sobre nossos serviços. 
                  Sua manifestação ajuda a aprimorar processos e garantir a qualidade do atendimento. É possível se manter <strong>anônimo</strong>, 
                  mas o fornecimento de contato facilita a apuração e o retorno.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
            <div className="bg-primary px-6 py-4">
              <h3 className="text-xl font-bold text-primary-foreground">Formulário de Manifestação</h3>
              <p className="text-primary-foreground/80 text-sm">Preencha os campos abaixo. Todos os dados serão tratados conforme a LGPD.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {/* Anti-bot honeypot */}
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              {/* Tipo de Manifestação */}
              <Select
                name="tipo"
                label="Tipo de manifestação"
                options={tipoOptions}
                placeholder="Selecione o tipo..."
                required
              />

              {/* Anonimato */}
              <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                <input
                  id="anonimo"
                  type="checkbox"
                  name="anonimo"
                  onChange={(e) => setAnonimo(e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <label htmlFor="anonimo" className="text-sm font-medium text-foreground">
                  Desejo manter anonimato
                </label>
              </div>

              {/* Identificação */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="nome"
                  label={`Nome completo ${anonimo ? '(opcional)' : ''}`}
                  placeholder="Seu nome completo"
                  required={!anonimo}
                  disabled={anonimo}
                />
                <Input
                  name="cpf"
                  label="CPF (opcional)"
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                />
              </div>

              {/* Contatos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="email"
                  name="email"
                  label={`E-mail ${anonimo ? '(opcional)' : '(um entre e-mail/telefone)'}`}
                  placeholder="seu@email.com"
                />
                <Input
                  name="telefone"
                  label={`Telefone ${anonimo ? '(opcional)' : '(um entre e-mail/telefone)'}`}
                  placeholder="(77) 99999-9999"
                />
              </div>

              {/* Preferência de retorno */}
              <Select
                name="retorno"
                label="Preferência de retorno"
                options={retornoOptions}
                defaultValue="email"
              />

              {/* Dados do ocorrido */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-foreground border-b border-border pb-2">Dados do Ocorrido</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    name="protocolo"
                    label="Protocolo (se houver)"
                    placeholder="Número do protocolo"
                  />
                  <Input
                    type="date"
                    name="data_ocorrido"
                    label="Data do ocorrido"
                  />
                </div>
                
                <Input
                  name="envolvidos"
                  label="Pessoas envolvidas"
                  placeholder="Nomes, cargos ou funções"
                />
                
                <Textarea
                  name="relato"
                  label="Relato detalhado"
                  placeholder="Descreva o fato com detalhes: datas, horários, local, serviços, valores, etc."
                  rows={8}
                  required
                />
              </div>

              {/* Anexos */}
              <FileUpload
                name="anexos"
                label="Anexos (opcional)"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                maxSizeMB={5}
                acceptedTypes={['PDF', 'JPG', 'PNG']}
                helperText="Até 5 arquivos, máximo 5MB cada"
              />

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
                  e autorizo o uso dos dados para análise da manifestação.
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
                  {submitting ? 'Enviando...' : 'Enviar Manifestação'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Modal – Política de Privacidade */}
      {showPolicy && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowPolicy(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl rounded-2xl bg-card shadow-2xl border border-border">
              <div className="flex items-center justify-between border-b border-border p-4">
                <h3 className="text-lg font-semibold text-card-foreground">Política de Privacidade</h3>
                <button
                  type="button"
                  onClick={() => setShowPolicy(false)}
                  className="rounded-lg border border-border px-3 py-1 text-sm hover:bg-muted"
                  aria-label="Fechar política de privacidade"
                >
                  Fechar
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto p-4 text-sm leading-relaxed text-muted-foreground space-y-4">
                <p><strong>INTRODUÇÃO</strong><br/>
                Nós, do Tabelionato Koerner de Notas e Protesto de Luís Eduardo Magalhães, atuamos em plena consonância com a Lei Geral de Proteção de Dados – LGPD (Lei Federal nº 13.709/2018), e atos normativos respectivos, em especial o Provimento Conjunto CGJ/CCI nº 03/2021 e Aviso Circular Conjunto nº CGJ/CCI-11/2021 do Tribunal de Justiça do Estado da Bahia, sendo nosso compromisso zelar pela proteção de dados pessoais com fundamento no respeito à privacidade, à autodeterminação informativa, à liberdade de expressão, informação, comunicação e opinião, à inviolabilidade da intimidade, da honra e da imagem, e dos direitos humanos.</p>
                
                <p><strong>COLETA DOS DADOS PESSOAIS</strong><br/>
                Dados pessoais são todas as informações relacionadas as pessoas naturais identificadas ou identificáveis (art. 5º, I, LGPD) que são coletados por este Tabelionato através da utilização do nosso serviço presencial ou eletrônico por meio do nosso site ou canais eletrônicos de comunicação.</p>
                
                <p><strong>TRATAMENTO DOS DADOS PESSOAIS</strong><br/>
                O tratamento dos dados pessoais configura-se como toda operação de coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle de informação dos dados pessoais (art. 5º, X, LGPD).</p>
                
                <p><strong>SEGURANÇA NO TRATAMENTO E ARMAZENAMENTO</strong><br/>
                Adotamos medidas técnicas e administrativas para proteção de dados, alinhadas ao Provimento nº 74/CNJ, assegurando integridade, disponibilidade e confidencialidade.</p>
                
                <p><strong>CONTATO DO ENCARREGADO</strong><br/>
                Canal de contato: <a href="mailto:abrante.marques@koerner.com.br" className="underline">abrante.marques@koerner.com.br</a> | (77) 3628‑1979.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}