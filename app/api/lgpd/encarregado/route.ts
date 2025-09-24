import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const TO = process.env.DPO_TO_EMAIL;
const FROM = process.env.DPO_FROM_EMAIL;

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

    await sendEmail({
      from: FROM || "lgpd@koerner.com.br",
      to: TO,
      subject: assunto,
      html,
      replyTo: email || undefined,
      attachments: attachments.length ? attachments : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("API error:", e);
    const message = e instanceof Error ? e.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}