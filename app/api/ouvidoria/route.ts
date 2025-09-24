import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const TO = process.env.OUVIDORIA_TO_EMAIL;
const FROM = process.env.OUVIDORIA_FROM_EMAIL;

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 100);
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

    // Honeypot check
    if ((form.get("website") as string)?.trim()) {
      return NextResponse.json({ ok: true });
    }

    const fields = Object.fromEntries(form.entries());

    const tipo = String(fields["tipo"] || "").trim();
    const relato = String(fields["relato"] || "").trim();
    const anonimo = !!fields["anonimo"];
    const email = String(fields["email"] || "").trim();
    const telefone = String(fields["telefone"] || "").trim();

    if (!tipo) return NextResponse.json({ error: "Tipo é obrigatório." }, { status: 400 });
    if (!relato) return NextResponse.json({ error: "Relato é obrigatório." }, { status: 400 });
    if (!anonimo && !email && !telefone) {
      return NextResponse.json({ error: "Informe e‑mail ou telefone (ou marque anonimato)." }, { status: 400 });
    }

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
      <h2>Nova manifestação de Ouvidoria – Koerner Tabelionato de Notas e Protesto</h2>
      <p><strong>Tipo:</strong> ${tipo}</p>
      <p><strong>Anonimato:</strong> ${anonimo ? "Sim" : "Não"}</p>
      <hr />
      <h3>Identificação</h3>
      <p><strong>Nome:</strong> ${anonimo ? "(anônimo)" : (fields["nome"] || "")}<br/>
         <strong>CPF:</strong> ${fields["cpf"] || ""}</p>
      <p><strong>E‑mail:</strong> ${email || ""} &nbsp; <strong>Telefone:</strong> ${telefone || ""}</p>
      <p><strong>Preferência de retorno:</strong> ${fields["retorno"] || ""}</p>
      <hr />
      <h3>Fatos</h3>
      <p><strong>Protocolo:</strong> ${fields["protocolo"] || ""}<br/>
         <strong>Data do ocorrido:</strong> ${fields["data_ocorrido"] || ""}<br/>
         <strong>Envolvidos:</strong> ${fields["envolvidos"] || ""}</p>
      <p><strong>Relato:</strong></p>
      <pre style="white-space:pre-wrap;font-family:ui-monospace,monospace;background:#f6f7f9;padding:12px;border-radius:8px">${relato}</pre>
    `;

    const assunto = `Ouvidoria – ${tipo}`;

    await sendEmail({
      from: FROM || "ouvidoria@koerner.com.br",
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