// Configuração alternativa com Gmail SMTP
// Substitua no lib/email.ts se quiser usar Gmail temporariamente

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'seu-email@gmail.com',
    pass: 'sua-senha-de-app', // Senha de aplicativo do Gmail
  },
});

export async function sendEmailViaGmail({
  from = 'seu-email@gmail.com',
  to,
  subject,
  html,
  attachments,
}: {
  from?: string;
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: string;
  }>;
}) {
  try {
    const result = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      attachments: attachments?.map(att => ({
        filename: att.filename,
        content: Buffer.from(att.content, 'base64'),
      })),
    });

    return {
      success: true,
      messageId: result.messageId,
      response: result,
    };
  } catch (error) {
    console.error('Erro ao enviar email via Gmail:', error);
    throw error;
  }
}