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
    const emailData: any = {
      from,
      to: [to],
      subject,
      html,
    };

    if (replyTo) {
      emailData.reply_to = replyTo;
    }

    if (attachments && attachments.length > 0) {
      emailData.attachments = attachments.map(att => ({
        filename: att.filename,
        content: att.content,
      }));
    }

    const result = await resend.emails.send(emailData);

    return {
      success: true,
      messageId: result.data?.id,
      response: result,
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
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