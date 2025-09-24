"use client";
import React, { useState } from "react";

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
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Contato com o Encarregado de Proteção de Dados – LGPD</h1>
        <p className="mt-3 text-sm text-gray-700">
          Em conformidade com o Provimento CNJ nº 149/2023 e com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), o Koerner Tabelionato de Notas e Protesto disponibiliza este canal para que os titulares de dados pessoais possam exercer seus direitos e contatar diretamente o Encarregado de Proteção de Dados (DPO) da serventia. Sua manifestação será analisada com a devida atenção e respondida dentro dos prazos legais.
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

        {/* Formulário */}
        <section className="mt-6 rounded-2xl border bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">📝 Formulário</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-6">
            {/* Anti‑bot honeypot */}
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            <div>
              <label className="block text-sm font-medium">Nome completo <span className="text-red-600">*</span></label>
              <input name="nome" required placeholder="Seu nome" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">E‑mail para contato <span className="text-red-600">*</span></label>
                <input type="email" name="email" required placeholder="voce@exemplo.com" className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Telefone (opcional)</label>
                <input name="telefone" placeholder="(77) 90000-0000" className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
            </div>

            <fieldset>
              <legend className="block text-sm font-medium">Tipo de solicitação <span className="text-red-600">*</span></legend>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  "Confirmação da existência de tratamento de dados",
                  "Acesso aos dados pessoais",
                  "Correção de dados incompletos, inexatos ou desatualizados",
                  "Informação sobre compartilhamento de dados",
                  "Outra (especificar abaixo)",
                ].map((label, idx) => (
                  <label key={idx} className="flex items-start gap-2 text-sm">
                    <input type="radio" name="tipo" value={label} className="mt-1" required />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label className="block text-sm font-medium">Descrição da solicitação <span className="text-red-600">*</span></label>
              <textarea name="descricao" required rows={6} className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="Descreva a sua solicitação relacionada a dados pessoais."></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium">Anexar documentos (opcional)</label>
              <input type="file" name="anexos" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.odt" className="mt-1" />
              <p className="mt-1 text-xs text-gray-500">Aceitamos PDF, JPG, PNG, DOC, DOCX e ODT. Até 5 arquivos / 5MB cada.</p>
            </div>

            {err && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{err}</div>
            )}
            {ok && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{ok}</div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button type="reset" className="rounded-xl border px-4 py-2">Limpar</button>
              <button disabled={submitting} className="rounded-xl bg-black px-5 py-2 text-white disabled:opacity-60">
                {submitting ? "Enviando…" : "Enviar"}
              </button>
            </div>
          </form>
        </section>

        <p className="mt-6 text-xs text-gray-600 border-t pt-4">
          ⚖ As informações prestadas neste formulário serão utilizadas exclusivamente para o atendimento da sua solicitação relacionada ao tratamento de dados pessoais, conforme previsto na LGPD e no Provimento CNJ nº 149/2023.
        </p>

        <div className="mt-10 text-sm text-gray-700 space-y-2">
          <p><strong>Koerner Tabelionato de Notas e Protesto</strong></p>
          <p>Rua José Cardoso de Lima, 1230, Centro<br/>Luís Eduardo Magalhães‑BA – CEP: 47850‑003</p>
          <p>Tel: (77) 3628‑1979 / (77) 3022‑2931</p>
          <p>Horário de Atendimento: Segunda à Sexta 08:00 - 16:00</p>
        </div>
      </div>
    </main>
  );
}