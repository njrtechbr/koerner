import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

// Compatibilidade com transporter (se necessário)
export const transporter = {
  sendMail: async (options: any) => {
    return sendEmail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
      attachments: options.attachments,
    });
  },
  verify: async () => {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY não configurada');
    }
    return true;
  },
};

// Função auxiliar para enviar emails
export async function sendEmail({
  from = 'noreply@resend.dev',
  to,
  subject,
  html,
  replyTo,
  attachments,
}: {
  from?: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    encoding?: string;
  }>;
}) {
  try {
    console.log('📧 [EMAIL SERVICE] Iniciando envio...');
    console.log('   From:', from);
    console.log('   To:', to);
    console.log('   Subject:', subject);
    console.log('   Has attachments:', !!(attachments && attachments.length > 0));

    const emailData: any = {
      from,
      to: [to],
      subject,
      html,
    };

    if (replyTo) {
      emailData.reply_to = replyTo;
      console.log('   Reply-To:', replyTo);
    }

    if (attachments && attachments.length > 0) {
      // Filtrar anexos válidos
      const validAttachments = attachments.filter(att => 
        att.filename && att.content && att.content.trim().length > 0
      );
      
      if (validAttachments.length > 0) {
        emailData.attachments = validAttachments.map(att => ({
          filename: att.filename,
          content: att.content,
        }));
        console.log('   Attachments:', validAttachments.length, 'valid files');
      } else {
        console.log('   Attachments: 0 valid files (skipping empty attachments)');
      }
    }

    console.log('🚀 [EMAIL SERVICE] Enviando via Resend...');
    const result = await resend.emails.send(emailData);

    console.log('✅ [EMAIL SERVICE] Email enviado com sucesso!');
    console.log('   Message ID:', result.data?.id);
    console.log('   Result:', result);

    return {
      success: true,
      messageId: result.data?.id,
      response: result,
    };
  } catch (error) {
    console.error('❌ [EMAIL SERVICE] Erro ao enviar email:', error);
    throw error;
  }
}

// Função para verificar a conexão
export async function verifyConnection() {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY não configurada');
    }
    return true;
  } catch (error) {
    throw error;
  }
}