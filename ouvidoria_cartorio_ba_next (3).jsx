// NOTE FOR PREVIEW: this canvas is a single TSX file so it can render here without build tools.
// The real project is multi‑file (Next.js App Router). Non‑TSX files are included below
// inside block comments so they DON'T break compilation. Copy each commented block into its own
// file in your project structure..

// ============================================================================
// app/trabalhe-conosco/page.tsx  (Client UI – rendered in this canvas)
// ============================================================================
"use client";
import React, { useState } from "react";

// Helper exported for tests: deterministic protocol generator (Trabalhe Conosco)
export function generateProtocolTC(date: Date = new Date(), randomFn: () => number = Math.random): string {
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
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Trabalhe Conosco – Koerner Tabelionato de Notas e Protesto</h1>
        <p className="mt-2 text-sm text-gray-600">
          Envie seu currículo para nosso banco de talentos. Seus dados serão tratados conforme a LGPD e nossa Política de Privacidade.
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

        {/* Intro */}
        <section className="mt-6 rounded-2xl border bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">Como funciona</h2>
          <p className="mt-2 text-sm text-gray-700">
            Preencha seus dados, selecione a área de interesse e <strong>anexe seu currículo</strong> (PDF/DOC até 10MB). Caso haja vaga compatível, entraremos em contato.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-6 rounded-2xl shadow">
          {/* Anti‑bot honeypot */}
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

          {/* Identificação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Nome completo <span className="text-red-600">*</span></label>
              <input name="nome" required placeholder="Seu nome" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">E‑mail <span className="text-red-600">*</span></label>
              <input type="email" name="email" required placeholder="voce@exemplo.com" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Telefone</label>
              <input name="telefone" placeholder="(77) 90000-0000" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">LinkedIn</label>
              <input type="url" name="linkedin" placeholder="https://www.linkedin.com/in/usuario" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
          </div>

          {/* Vaga */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Área de interesse</label>
              <select name="area" className="mt-1 w-full rounded-xl border px-3 py-2">
                <option value="">Selecione…</option>
                <option>Atendimento</option>
                <option>Notas/Escrituras</option>
                <option>Protesto</option>
                <option>Administrativo/Financeiro</option>
                <option>TI</option>
                <option>Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Pretensão salarial (opcional)</label>
              <input name="pretensao" placeholder="R$" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Mensagem (opcional)</label>
            <textarea name="mensagem" rows={5} className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="Resumo de experiência, disponibilidade, etc."></textarea>
          </div>

          {/* Currículo */}
          <div>
            <label className="block text-sm font-medium">Currículo (PDF, DOC, DOCX, ODT) – até 10MB <span className="text-red-600">*</span></label>
            <input type="file" name="cv" required accept=".pdf,.doc,.docx,.odt" className="mt-1" />
          </div>

          {/* LGPD */}
          <div className="flex items-start gap-3">
            <input id="lgpd" type="checkbox" name="lgpd" required className="mt-1 h-4 w-4" />
            <label htmlFor="lgpd" className="text-sm">
              Li e aceito a <button type="button" onClick={() => setShowPolicy(true)} className="underline">política de privacidade</button> e autorizo o uso dos dados para fins de recrutamento e seleção.
            </label>
          </div>

          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{err}</div>
          )}
          {ok && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              {ok}
              {protocol && (
                <div className="mt-1 text-xs text-gray-700">Protocolo: <strong>{protocol}</strong></div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button type="reset" className="rounded-xl border px-4 py-2">Limpar</button>
            <button disabled={submitting} className="rounded-xl bg-black px-5 py-2 text-white disabled:opacity-60">
              {submitting ? "Enviando…" : "Enviar currículo"}
            </button>
          </div>
        </form>

        <div className="mt-10 text-sm text-gray-700 space-y-2">
          <p><strong>Koerner Tabelionato de Notas e Protesto</strong></p>
          <p>Rua José Cardoso de Lima, 1230, Centro<br/>Luís Eduardo Magalhães‑BA – CEP: 47850‑003</p>
          <p>Tel: (77) 3628‑1979 / (77) 3022‑2931</p>
          <p>Horário de Atendimento: Segunda à Sexta 08:00 - 16:00</p>
        </div>
      </div>

      {/* Modal – Política de Privacidade (resumo) */}
      {showPolicy && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPolicy(false)} aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b p-4">
                <h3 id="privacy-title" className="text-lg font-semibold">Política de Privacidade</h3>
                <button type="button" onClick={() => setShowPolicy(false)} className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50" aria-label="Fechar política de privacidade">Fechar</button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto p-4 text-sm leading-relaxed text-gray-800 space-y-4">
                <p><strong>COLETA E TRATAMENTO</strong><br/>Os dados e documentos enviados serão utilizados exclusivamente para análise de perfil profissional, contato e etapas de seleção, em conformidade com a LGPD e atos normativos aplicáveis.</p>
                <p><strong>COMPARTILHAMENTO</strong><br/>Poderá haver compartilhamento com provedores de tecnologia contratados e autoridades quando exigido por lei, sempre limitado ao mínimo necessário.</p>
                <p><strong>ARMAZENAMENTO E SEGURANÇA</strong><br/>Os dados são armazenados com medidas técnicas e administrativas adequadas. Você pode solicitar atualização ou correção dos seus dados pelos nossos canais.</p>
                <p><strong>CONTATO DO ENCARREGADO</strong><br/><a className="underline" href="mailto:abrante.marques@koerner.com.br">abrante.marques@koerner.com.br</a> | (77) 3628‑1979.</p>
                <p className="text-xs text-gray-500">Versão resumida. Para a íntegra da política, consulte a página institucional.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ============================================================================
app/api/trabalhe-conosco/route.ts  (Server route – copy this into your project file)
============================================================================ */
/*
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = process.env.RH_TO_EMAIL || process.env.OUVIDORIA_TO_EMAIL; // fallback se quiser reutilizar

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

    // Honeypot
    if ((form.get("website") as string)?.trim()) {
      return NextResponse.json({ ok: true });
    }

    const fields = Object.fromEntries(form.entries());

    const nome = String(fields["nome"] || "").trim();
    const email = String(fields["email"] || "").trim();

    if (!nome) return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
    if (!email) return NextResponse.json({ error: "E‑mail é obrigatório." }, { status: 400 });

    // CV (obrigatório 1 arquivo <= 10MB)
    const files = form.getAll("cv");
    const file = files.find((f) => f instanceof File) as File | undefined;
    if (!file) return NextResponse.json({ error: "Anexe o currículo." }, { status: 400 });
    if (file.size <= 0) return NextResponse.json({ error: "Arquivo de currículo inválido." }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "Currículo acima de 10MB." }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());

    const html = `
      <h2>Candidatura – Trabalhe Conosco (Koerner)</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>E‑mail:</strong> ${email} &nbsp; <strong>Telefone:</strong> ${fields["telefone"] || ""}</p>
      <p><strong>LinkedIn:</strong> ${fields["linkedin"] || ""}</p>
      <p><strong>Área de interesse:</strong> ${fields["area"] || ""} &nbsp; <strong>Pretensão:</strong> ${fields["pretensao"] || ""}</p>
      <p><strong>Mensagem:</strong></p>
      <pre style="white-space:pre-wrap;font-family:ui-monospace,monospace;background:#f6f7f9;padding:12px;border-radius:8px">${fields["mensagem"] || ""}</pre>
    `;

    const assunto = `Trabalhe Conosco – ${nome}`;

    const { error } = await resend.emails.send({
      from: process.env.RH_FROM_EMAIL || process.env.OUVIDORIA_FROM_EMAIL || "rh@seu-dominio.vercel.app",
      to: TO,
      subject: assunto,
      html,
      reply_to: email || undefined,
      attachments: [
        {
          filename: sanitizeFilename(file.name),
          content: buf.toString("base64"),
        },
      ],
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
  "name": "trabalhe-conosco-koerner",
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
__tests__/trabalhe.route.test.ts (tests for Trabalhe Conosco route) – copy into repo
============================================================================ */
/*
import { describe, it, expect } from "vitest";
import { NextResponse } from "next/server";
import { POST } from "../app/api/trabalhe-conosco/route"; // ajuste o caminho

function makeRequest(formData?: FormData, contentType = "multipart/form-data"): any {
  return {
    headers: new Map([["content-type", contentType]]),
    formData: async () => formData ?? new FormData(),
  } as any;
}

describe("/api/trabalhe-conosco POST", () => {
  it("rejects non‑multipart", async () => {
    const res = await POST(makeRequest(undefined, "application/json"));
    const json = await (res as NextResponse).json();
    expect((res as NextResponse).status).toBe(400);
    expect(json.error).toMatch(/multipart/);
  });

  it("requires nome and email", async () => {
    const fd = new FormData();
    // missing fields
    const res = await POST(makeRequest(fd));
    const json = await (res as NextResponse).json();
    expect((res as NextResponse).status).toBe(400);
    expect(json.error).toMatch(/Nome|E‑mail/);
  });

  it("requires a CV file", async () => {
    const fd = new FormData();
    fd.set("nome", "Teste");
    fd.set("email", "t@t.com");
    const res = await POST(makeRequest(fd));
    const json = await (res as NextResponse).json();
    expect((res as NextResponse).status).toBe(400);
    expect(json.error).toMatch(/currícul/);
  });
});
*/

/* ============================================================================
__tests__/protocol.tc.test.ts (tests for KOTC protocol) – copy into repo
============================================================================ */
/*
import { describe, it, expect } from "vitest";
import { generateProtocolTC } from "../app/trabalhe-conosco/page"; // ajuste o caminho

describe("generateProtocolTC", () => {
  it("has KOTC prefix and current year", () => {
    const date = new Date("2025-09-23T10:00:00-03:00");
    const id = generateProtocolTC(date, () => 0.123456);
    expect(id).toMatch(/^KOTC-2025-\d{6}$/);
  });

  it("pads with zeros to 6 digits", () => {
    const date = new Date("2025-01-01T00:00:00-03:00");
    const id = generateProtocolTC(date, () => 0.000001);
    expect(id.endsWith("000001")).toBe(true);
  });
});
*/
