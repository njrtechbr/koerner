// NOTE FOR PREVIEW: this canvas is a single TSX file so it can render here without build tools.
// The real project is multi‑file (Next.js App Router). Non‑TSX files are included below
// inside block comments so they DON'T break compilation. Copy each commented block into its own
// file in your project structure..

// ============================================================================
// app/lgpd/encarregado/page.tsx  (Client UI – rendered in this canvas)
// ============================================================================
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
          <button
            type="button"
            onClick={() => (window.location.href = "https://www.koerner.com.br")}
            className="rounded-xl border px-4 py-2 hover:bg-gray-100"
            aria-label="Voltar ao site Koerner"
          >
            ← Voltar ao site koerner.com.br
          </button>
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

/* ============================================================================
app/api/lgpd/encarregado/route.ts  (Server route – copy this into your project file)
============================================================================ */
/*
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = process.env.DPO_TO_EMAIL || process.env.OUVIDORIA_TO_EMAIL; // defina o e‑mail do encarregado (DPO)

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 120);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (!process.env.RESEND_API_KEY || !TO) {
      return NextResponse.json({ error: "Configuração de e‑mail ausente." }, { status: 500 });
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Envie como multipart/form-data." }, { status: 400 });
    }

    const form = await req.formData();

    if ((form.get("website") as string)?.trim()) {
      return NextResponse.json({ ok: true });
    }

    const fields = Object.fromEntries(form.entries());

    const nome = String(fields["nome"] || "").trim();
    const email = String(fields["email"] || "").trim();
    const telefone = String(fields["telefone"] || "").trim();
    const tipo = String(fields["tipo"] || "").trim();
    const descricao = String(fields["descricao"] || "").trim();

    if (!nome) return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
    if (!email) return NextResponse.json({ error: "E‑mail é obrigatório." }, { status: 400 });
    if (!tipo) return NextResponse.json({ error: "Tipo é obrigatório." }, { status: 400 });
    if (!descricao) return NextResponse.json({ error: "Descrição é obrigatória." }, { status: 400 });

    const attachments: { filename: string; content: string }[] = [];
    const anexos = form.getAll("anexos");
    for (const file of anexos) {
      if (!(file instanceof File)) continue;
      if (attachments.length >= 5) break;
      if (file.size > 5 * 1024 * 1024) continue;
      const buf = Buffer.from(await file.arrayBuffer());
      attachments.push({ filename: sanitizeFilename(file.name), content: buf.toString("base64") });
    }

    const html = `
      <h2>Contato – Encarregado de Proteção de Dados (LGPD)</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>E‑mail:</strong> ${email} &nbsp; <strong>Telefone:</strong> ${telefone}</p>
      <p><strong>Tipo de solicitação:</strong> ${tipo}</p>
      <p><strong>Descrição:</strong></p>
      <pre style="white-space:pre-wrap;font-family:ui-monospace,monospace;background:#f6f7f9;padding:12px;border-radius:8px">${descricao}</pre>
    `;

    const assunto = `LGPD – ${tipo} – ${nome}`;

    const { error } = await resend.emails.send({
      from: process.env.DPO_FROM_EMAIL || process.env.OUVIDORIA_FROM_EMAIL || "lgpd@seu-dominio.vercel.app",
      to: TO,
      subject: assunto,
      html,
      reply_to: email || undefined,
      attachments: attachments.length ? attachments : undefined,
    });

    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
*/

/* ============================================================================
package.json  (COMMENTED here to avoid breaking TSX – copy to your project)
============================================================================ */
/*
{
  "name": "koerner-lgpd-encarregado",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "resend": "^3.4.0"
  },
  "devDependencies": {
    "vitest": "^2.0.5",
    "@vitest/coverage-v8": "^2.0.5",
    "@types/node": "^20.14.9",
    "@types/react": "^18.3.7"
  }
}
*/

/* ============================================================================
__tests__/lgpd.encarregado.route.test.ts – copy into repo
============================================================================ */
/*
import { describe, it, expect } from "vitest";
import { NextResponse } from "next/server";
import { POST } from "../app/api/lgpd/encarregado/route"; // ajuste path

function makeRequest(formData?: FormData, contentType = "multipart/form-data"): any {
  return {
    headers: new Map([["content-type", contentType]]),
    formData: async () => formData ?? new FormData(),
  } as any;
}

describe("/api/lgpd/encarregado POST", () => {
  it("rejects non‑multipart", async () => {
    const res = await POST(makeRequest(undefined, "application/json"));
    const json = await (res as NextResponse).json();
    expect((res as NextResponse).status).toBe(400);
    expect(json.error).toMatch(/multipart/);
  });

  it("requires core fields", async () => {
    const fd = new FormData();
    const res = await POST(makeRequest(fd));
    const json = await (res as NextResponse).json();
    expect((res as NextResponse).status).toBe(400);
    expect(json.error).toMatch(/Nome|E‑mail|Tipo|Descrição/);
  });

  it("accepts valid minimal submission", async () => {
    const fd = new FormData();
    fd.set("nome", "Titular Teste");
    fd.set("email", "titular@exemplo.com");
    fd.set("tipo", "Acesso aos dados pessoais");
    fd.set("descricao", "Quero acesso aos meus dados.");
    const res = await POST(makeRequest(fd));
    expect((res as NextResponse).status).toBe(200);
  });
});
*/
