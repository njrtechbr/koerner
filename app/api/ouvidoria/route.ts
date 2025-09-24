import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { createEmailTemplate, createConfirmationContent } from "@/lib/email-templates";

const TO = process.env.OUVIDORIA_TO_EMAIL;
const FROM = process.env.OUVIDORIA_FROM_EMAIL;

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 100);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log('🔵 [OUVIDORIA API] Iniciando processamento...');
  
  try {
    console.log('🔑 [OUVIDORIA API] RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Configurada' : 'NÃO CONFIGURADA');
    console.log('📧 [OUVIDORIA API] TO:', TO || 'NÃO CONFIGURADO');
    console.log('📤 [OUVIDORIA API] FROM:', FROM || 'NÃO CONFIGURADO');
    
    if (!process.env.RESEND_API_KEY || !TO) {
      console.error('❌ [OUVIDORIA API] Configuração ausente');
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
      if (file.size === 0) continue; // Pular arquivos vazios
      if (attachments.length >= 5) break;
      if (file.size > 5 * 1024 * 1024) continue;
      const buf = Buffer.from(await file.arrayBuffer());
      if (buf.length === 0) continue; // Pular buffers vazios
      attachments.push({ filename: sanitizeFilename(file.name), content: buf.toString("base64") });
    }

    // Gerar protocolo
    const protocol = `OUV-${new Date().getFullYear()}-${Math.floor(Math.random() * 999999).toString().padStart(6, "0")}`;

    // Template para equipe interna
    const internalContent = `
      <div class="section">
        <h2>Informações da Manifestação</h2>
        <div class="field-group">
          <div class="field">
            <span class="field-label">Tipo:</span>
            <span class="field-value">${tipo}</span>
          </div>
          <div class="field">
            <span class="field-label">Protocolo:</span>
            <span class="field-value">${protocol}</span>
          </div>
          <div class="field">
            <span class="field-label">Anonimato:</span>
            <span class="field-value">${anonimo ? "Sim" : "Não"}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Identificação</h2>
        <div class="field-group">
          <div class="field">
            <span class="field-label">Nome:</span>
            <span class="field-value">${anonimo ? "(anônimo)" : (fields["nome"] || "")}</span>
          </div>
          <div class="field">
            <span class="field-label">CPF:</span>
            <span class="field-value">${fields["cpf"] || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">E-mail:</span>
            <span class="field-value">${email || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">Telefone:</span>
            <span class="field-value">${telefone || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">Retorno via:</span>
            <span class="field-value">${fields["retorno"] || ""}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Detalhes do Ocorrido</h2>
        <div class="field-group">
          <div class="field">
            <span class="field-label">Protocolo ref.:</span>
            <span class="field-value">${fields["protocolo"] || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">Data do ocorrido:</span>
            <span class="field-value">${fields["data_ocorrido"] || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">Envolvidos:</span>
            <span class="field-value">${fields["envolvidos"] || ""}</span>
          </div>
        </div>
        <h3>Relato:</h3>
        <div class="pre-text">${relato}</div>
      </div>`;

    const internalHtml = createEmailTemplate("Nova Manifestação de Ouvidoria", internalContent);
    const assunto = `Ouvidoria – ${tipo} – ${protocol}`;

    // Enviar para equipe interna
    console.log('📤 [OUVIDORIA API] Enviando email interno...');
    console.log('📎 [OUVIDORIA API] Anexos encontrados:', attachments.length);
    
    const emailData: any = {
      from: FROM || "ouvidoria@koerner.com.br",
      to: TO,
      subject: assunto,
      html: internalHtml,
      replyTo: email || undefined,
    };
    
    // Só adicionar attachments se houver arquivos válidos
    if (attachments.length > 0) {
      emailData.attachments = attachments;
      console.log('📎 [OUVIDORIA API] Enviando com anexos:', attachments.map(a => a.filename));
    }
    
    const internalResult = await sendEmail(emailData);
    console.log('✅ [OUVIDORIA API] Email interno enviado:', internalResult.messageId);

    // Enviar confirmação para o usuário (se não for anônimo e tiver email)
    if (!anonimo && email) {
      console.log('📤 [OUVIDORIA API] Enviando confirmação para usuário...');
      const confirmationContent = createConfirmationContent('ouvidoria', email, protocol);
      const confirmationHtml = createEmailTemplate("Confirmação - Ouvidoria", confirmationContent, true);
      
      const confirmationResult = await sendEmail({
        from: FROM || "ouvidoria@koerner.com.br",
        to: email,
        subject: `Confirmação de Recebimento - Ouvidoria - ${protocol}`,
        html: confirmationHtml,
      });
      console.log('✅ [OUVIDORIA API] Confirmação enviada:', confirmationResult.messageId);
    } else {
      console.log('ℹ️ [OUVIDORIA API] Pular confirmação (anônimo ou sem email)');
    }

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