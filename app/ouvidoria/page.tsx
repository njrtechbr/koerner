"use client";
import React, { useState } from "react";

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

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Ouvidoria – Koerner Tabelionato de Notas e Protesto</h1>
        <p className="mt-2 text-sm text-gray-600">
          Preencha os campos abaixo. Dados serão tratados conforme a LGPD exclusivamente para apuração da manifestação.
        </p>

        {/* Acesso rápido */}
        <div className="mt-4 flex items-center justify-between">
          <a
            href="/"
            className="rounded-xl border px-4 py-2 hover:bg-gray-100"
            aria-label="Voltar ao início"
          >
            ← Voltar ao início
          </a>
          <a
            href="https://www.koerner.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border px-4 py-2 hover:bg-gray-100"
            aria-label="Visitar site Koerner"
          >
            Visitar koerner.com.br →
          </a>
        </div>

        {/* O que é a Ouvidoria */}
        <section className="mt-6 rounded-2xl border bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">O que é a Ouvidoria?</h2>
          <p className="mt-2 text-sm text-gray-700">
            A Ouvidoria é o canal institucional para você registrar <strong>reclamações, denúncias, sugestões, elogios e dúvidas</strong>
            sobre os serviços notariais e de protesto. Sua manifestação ajuda a aprimorar processos, garantir a <strong>qualidade do atendimento</strong>
            e assegurar o cumprimento da legislação. Quando preferir, é possível se manter <strong>anônimo</strong>, mas o fornecimento de contato
            facilita a apuração e o retorno.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-6 rounded-2xl shadow">
          {/* Anti‑bot honeypot */}
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

          {/* Tipo de Manifestação */}
          <div>
            <label className="block text-sm font-medium">
              Tipo de manifestação <span className="text-red-600">*</span>
            </label>
            <select name="tipo" required className="mt-1 w-full rounded-xl border px-3 py-2">
              <option value="">Selecione…</option>
              <option>Reclamação</option>
              <option>Denúncia</option>
              <option>Sugestão</option>
              <option>Elogio</option>
              <option>Dúvida</option>
              <option>Outro</option>
            </select>
          </div>

          {/* Anonimato */}
          <div className="flex items-center gap-3">
            <input
              id="anonimo"
              type="checkbox"
              name="anonimo"
              onChange={(e) => setAnonimo(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="anonimo" className="text-sm">
              Desejo manter anonimato
            </label>
          </div>

          {/* Identificação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Nome completo {anonimo ? <span className="text-gray-400">(opcional)</span> : <span className="text-red-600">*</span>}
              </label>
              <input
                name="nome"
                required={!anonimo}
                disabled={anonimo}
                placeholder="Seu nome"
                className="mt-1 w-full rounded-xl border px-3 py-2 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                CPF <span className="text-gray-400">(opcional)</span>
              </label>
              <input name="cpf" inputMode="numeric" placeholder="000.000.000-00" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
          </div>

          {/* Contatos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                E‑mail {anonimo ? <span className="text-gray-400">(opcional)</span> : <span className="text-gray-500">(um entre e‑mail/telefone)</span>}
              </label>
              <input type="email" name="email" placeholder="voce@exemplo.com" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Telefone {anonimo ? <span className="text-gray-400">(opcional)</span> : <span className="text-gray-500">(um entre e‑mail/telefone)</span>}
              </label>
              <input name="telefone" placeholder="(77) 90000-0000" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
          </div>

          {/* Preferência de retorno */}
          <div>
            <label className="block text-sm font-medium">Preferência de retorno</label>
            <select name="retorno" className="mt-1 w-full rounded-xl border px-3 py-2">
              <option value="email">E‑mail</option>
              <option value="telefone">Telefone</option>
              <option value="nenhum">Não desejo retorno</option>
            </select>
          </div>

          {/* Dados do ocorrido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Protocolo (se houver)</label>
              <input name="protocolo" placeholder="Número do protocolo" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Data do ocorrido</label>
              <input type="date" name="data_ocorrido" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Pessoas envolvidas</label>
            <input name="envolvidos" placeholder="Nomes, cargos" className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Relato detalhado <span className="text-red-600">*</span>
            </label>
            <textarea
              name="relato"
              required
              rows={8}
              className="mt-1 w-full rounded-xl border px-3 py-2"
              placeholder="Descreva o fato, com datas, horários, local, serviços, valores, etc."
            ></textarea>
          </div>

          {/* Anexos */}
          <div>
            <label className="block text-sm font-medium">Anexos (PDF, JPG, PNG) — até 5 arquivos / 5MB cada</label>
            <input type="file" name="anexos" multiple accept=".pdf,.jpg,.jpeg,.png" className="mt-1" />
          </div>

          {/* LGPD */}
          <div className="flex items-start gap-3">
            <input id="lgpd" type="checkbox" name="lgpd" required className="mt-1 h-4 w-4" />
            <label htmlFor="lgpd" className="text-sm">
              Li e aceito a <button type="button" onClick={() => setShowPolicy(true)} className="underline">política de privacidade</button> e autorizo o uso dos dados para análise da manifestação.
            </label>
          </div>

          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{err}</div>
          )}
          {ok && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{ok}</div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button type="reset" className="rounded-xl border px-4 py-2">
              Limpar
            </button>
            <button disabled={submitting} className="rounded-xl bg-black px-5 py-2 text-white disabled:opacity-60">
              {submitting ? "Enviando…" : "Enviar manifestação"}
            </button>
          </div>
        </form>

        <div className="mt-10 text-sm text-gray-700 space-y-2">
          <p><strong>Koerner Tabelionato de Notas e Protesto</strong></p>
          <p>Rua José Cardoso de Lima, 1230, Centro<br/>Luis Eduardo Magalhães‑BA – CEP: 47850‑003</p>
          <p>Tel: (77) 3628‑1979 / (77) 3022‑2931</p>
          <p>Horário de Atendimento: Segunda à Sexta 08:00 - 16:00</p>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Em caso de indícios de ilícitos, a ouvidoria pode resguardar o sigilo e solicitar complementações. Denúncias anônimas podem limitar o retorno.
        </p>
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
            <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="text-lg font-semibold">Política de Privacidade</h3>
                <button
                  type="button"
                  onClick={() => setShowPolicy(false)}
                  className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                  aria-label="Fechar política de privacidade"
                >
                  Fechar
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto p-4 text-sm leading-relaxed text-gray-800 space-y-4">
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
    </main>
  );
}