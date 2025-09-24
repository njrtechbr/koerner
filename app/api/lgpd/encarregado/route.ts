import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { createEmailTemplate, createConfirmationContent } from "@/lib/email-templates";

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
      if (file.size === 0) continue; // Pular arquivos vazios
      if (attachments.length >= 5) break;
      if (file.size > 5 * 1024 * 1024) continue;
      const buf = Buffer.from(await file.arrayBuffer());
      if (buf.length === 0) continue; // Pular buffers vazios  
      attachments.push({ filename: sanitizeFilename(file.name), content: buf.toString("base64") });
    }

    // Gerar protocolo
    const protocol = `LGPD-${new Date().getFullYear()}-${Math.floor(Math.random() * 999999).toString().padStart(6, "0")}`;

    // Template para DPO
    const internalContent = `
      <div class="section">
        <h2>Dados de Contato</h2>
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
            <span class="field-value">${telefone}</span>
          </div>
          <div class="field">
            <span class="field-label">Protocolo:</span>
            <span class="field-value">${protocol}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Solicitação</h2>
        <div class="field-group">
          <div class="field">
            <span class="field-label">Tipo:</span>
            <span class="field-value">${tipo}</span>
          </div>
        </div>
        <h3>Descrição:</h3>
        <div class="pre-text">${descricao}</div>
      </div>

      ${attachments.length > 0 ? `
      <div class="section">
        <h2>Documentos Anexados</h2>
        <p>${attachments.length} arquivo(s) anexado(s)</p>
      </div>` : ''}`;

    const internalHtml = createEmailTemplate("Nova Solicitação LGPD", internalContent);
    const assunto = `LGPD – ${tipo} – ${protocol}`;

    // Enviar para DPO
    console.log('📤 [LGPD API] Enviando email interno...');
    console.log('📎 [LGPD API] Anexos encontrados:', attachments.length);
    
    const emailData: any = {
      from: FROM || "lgpd@koerner.com.br",
      to: TO,
      subject: assunto,
      html: internalHtml,
      replyTo: email || undefined,
    };
    
    // Só adicionar attachments se houver arquivos válidos
    if (attachments.length > 0) {
      emailData.attachments = attachments;
      console.log('📎 [LGPD API] Enviando com anexos:', attachments.map(a => a.filename));
    }
    
    const internalResult = await sendEmail(emailData);
    console.log('✅ [LGPD API] Email interno enviado:', internalResult.messageId);

    // Enviar confirmação para o usuário
    console.log('📤 [LGPD API] Enviando confirmação para usuário...');
    const confirmationContent = createConfirmationContent('lgpd', email, protocol);
    const confirmationHtml = createEmailTemplate("Confirmação - Solicitação LGPD", confirmationContent, true);
    
    const confirmationResult = await sendEmail({
      from: FROM || "lgpd@koerner.com.br",
      to: email,
      subject: `Confirmação de Recebimento - LGPD - ${protocol}`,
      html: confirmationHtml,
    });
    console.log('✅ [LGPD API] Confirmação enviada:', confirmationResult.messageId);

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