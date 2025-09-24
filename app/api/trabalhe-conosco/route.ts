import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const TO = process.env.RH_TO_EMAIL;
const FROM = process.env.RH_FROM_EMAIL;

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

    await sendEmail({
      from: FROM || "rh@koerner.com.br",
      to: TO,
      subject: assunto,
      html,
      replyTo: email || undefined,
      attachments: [
        {
          filename: sanitizeFilename(file.name),
          content: buf.toString("base64"),
        },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("API error:", e);
    const message = e instanceof Error ? e.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}