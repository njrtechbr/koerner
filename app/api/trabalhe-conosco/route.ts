import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { createEmailTemplate, createConfirmationContent } from "@/lib/email-templates";

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
    
    // Gerar protocolo
    const protocol = `TC-${new Date().getFullYear()}-${Math.floor(Math.random() * 999999).toString().padStart(6, "0")}`;

    // Template para RH
    const internalContent = `
      <div class="section">
        <h2>Dados Pessoais</h2>
        <div class="field-group">
          <div class="field">
            <span class="field-label">Nome:</span>
            <span class="field-value">${nome}</span>
          </div>
          <div class="field">
            <span class="field-label">E-mail:</span>
            <span class="field-value">${email}</span>
          </div>
          <div class="field">
            <span class="field-label">Telefone:</span>
            <span class="field-value">${fields["telefone"] || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">LinkedIn:</span>
            <span class="field-value">${fields["linkedin"] || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">Protocolo:</span>
            <span class="field-value">${protocol}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Informações Profissionais</h2>
        <div class="field-group">
          <div class="field">
            <span class="field-label">Área de interesse:</span>
            <span class="field-value">${fields["area"] || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">Pretensão salarial:</span>
            <span class="field-value">${fields["pretensao"] || ""}</span>
          </div>
        </div>
        ${fields["mensagem"] ? `
        <h3>Mensagem:</h3>
        <div class="pre-text">${fields["mensagem"]}</div>
        ` : ''}
      </div>

      <div class="section">
        <h2>Documentos</h2>
        <p><strong>Currículo anexado:</strong> ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</p>
      </div>`;

    const internalHtml = createEmailTemplate("Nova Candidatura - Trabalhe Conosco", internalContent);
    const assunto = `Trabalhe Conosco – ${nome} – ${protocol}`;

    // Enviar para RH
    console.log('📤 [TRABALHE-CONOSCO API] Enviando email interno...');
    const internalResult = await sendEmail({
      from: FROM || "rh@koerner.com.br",
      to: TO,
      subject: assunto,
      html: internalHtml,
      replyTo: email || undefined,
      attachments: [
        {
          filename: sanitizeFilename(file.name),
          content: buf.toString("base64"),
        },
      ],
    });
    console.log('✅ [TRABALHE-CONOSCO API] Email interno enviado:', internalResult.messageId);

    // Enviar confirmação para o candidato
    console.log('📤 [TRABALHE-CONOSCO API] Enviando confirmação para candidato...');
    const confirmationContent = createConfirmationContent('trabalhe-conosco', email, protocol);
    const confirmationHtml = createEmailTemplate("Confirmação - Trabalhe Conosco", confirmationContent, true);
    
    const confirmationResult = await sendEmail({
      from: FROM || "rh@koerner.com.br",
      to: email,
      subject: `Confirmação de Recebimento - Trabalhe Conosco - ${protocol}`,
      html: confirmationHtml,
    });
    console.log('✅ [TRABALHE-CONOSCO API] Confirmação enviada:', confirmationResult.messageId);

    return NextResponse.json({ 
      ok: true, 
      protocolo: protocol,
      data: new Date().toISOString() 
    });
  } catch (e: unknown) {
    console.error("API error:", e);
    const message = e instanceof Error ? e.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}