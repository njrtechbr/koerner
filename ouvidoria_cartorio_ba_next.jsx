// NOTE FOR PREVIEW: this canvas is a single TSX file so it can render here without build tools.
// The real project is multi‑file (Next.js App Router). Non‑TSX files are included below
// inside block comments so they DON'T break compilation. Copy each commented block into its own
// file in your project structure..

// ============================================================================
// app/ouvidoria/page.tsx  (Client UI – rendered in this canvas)
// ============================================================================
"use client";
import React, { useState } from "react";

export default function OuvidoriaPage(): JSX.Element {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [anonimo, setAnonimo] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    setErr(null);

    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);

    if (!anonimo) {
      const email = (fd.get("email") as string) || "";
      const telefone = (fd.get("telefone") as string) || "";
      if (!email && !telefone) {
        setErr("Informe e‑mail ou telefone para retorno (ou marque Anônimo).");
        setSubmitting(false);
        return;
      }
    }

    try {
      const r = await fetch("/api/ouvidoria", {
        method: "POST",
        body: fd,
      });
      let data: any = {};
      try {
        data = await r.json();
      } catch {
        // ignore
      }
      if (!r.ok) throw new Error(data?.error || "Falha ao enviar");
      setOk("Manifestação enviada com sucesso. Você receberá um protocolo por e‑mail (se informado).");
      form.reset();
      setAnonimo(false);
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
        <h1 className="text-3xl font-semibold tracking-tight">Ouvidoria – Koerner Tabelionato de Notas e Protesto</h1>
        <p className="mt-2 text-sm text-gray-600">
          Preencha os campos abaixo. Dados serão tratados conforme a LGPD exclusivamente para apuração da manifestação.
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

        {/* O que é a Ouvidoria */}
        <section className="mt-6 rounded-2xl border bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">O que é a Ouvidoria?</h2>
          <p className="mt-2 text-sm text-gray-700">
            A Ouvidoria é o canal institucional para você registrar <strong>reclamações, denúncias, sugestões, elogios e dúvidas</strong>
            sobre os serviços notariais e de protesto. Sua manifestação ajuda a aprimorar processos, garantir a <strong>qualidade do atendimento</strong>
            e assegurar o cumprimento da legislação. Quando preferir, é possível se manter <strong>anônimo</strong>, mas o fornecimento de contato
            facilita a apuração e o retorno.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-6 rounded-2xl shadow">
          {/* Anti‑bot honeypot */}
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

          {/* Tipo de Manifestação */}
          <div>
            <label className="block text-sm font-medium">
              Tipo de manifestação <span className="text-red-600">*</span>
            </label>
            <select name="tipo" required className="mt-1 w-full rounded-xl border px-3 py-2">
              <option value="">Selecione…</option>
              <option>Reclamação</option>
              <option>Denúncia</option>
              <option>Sugestão</option>
              <option>Elogio</option>
              <option>Dúvida</option>
              <option>Outro</option>
            </select>
          </div>

          {/* Anonimato */}
          <div className="flex items-center gap-3">
            <input
              id="anonimo"
              type="checkbox"
              name="anonimo"
              onChange={(e) => setAnonimo(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="anonimo" className="text-sm">
              Desejo manter anonimato
            </label>
          </div>

          {/* Identificação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Nome completo {anonimo ? <span className="text-gray-400">(opcional)</span> : <span className="text-red-600">*</span>}
              </label>
              <input
                name="nome"
                required={!anonimo}
                disabled={anonimo}
                placeholder="Seu nome"
                className="mt-1 w-full rounded-xl border px-3 py-2 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                CPF <span className="text-gray-400">(opcional)</span>
              </label>
              <input name="cpf" inputMode="numeric" placeholder="000.000.000-00" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
          </div>

          {/* Contatos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                E‑mail {anonimo ? <span className="text-gray-400">(opcional)</span> : <span className="text-gray-500">(um entre e‑mail/telefone)</span>}
              </label>
              <input type="email" name="email" placeholder="voce@exemplo.com" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Telefone {anonimo ? <span className="text-gray-400">(opcional)</span> : <span className="text-gray-500">(um entre e‑mail/telefone)</span>}
              </label>
              <input name="telefone" placeholder="(77) 90000-0000" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
          </div>

          {/* Preferência de retorno */}
          <div>
            <label className="block text-sm font-medium">Preferência de retorno</label>
            <select name="retorno" className="mt-1 w-full rounded-xl border px-3 py-2">
              <option value="email">E‑mail</option>
              <option value="telefone">Telefone</option>
              <option value="nenhum">Não desejo retorno</option>
            </select>
          </div>

          {/* Dados do ocorrido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Protocolo (se houver)</label>
              <input name="protocolo" placeholder="Número do protocolo" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Data do ocorrido</label>
              <input type="date" name="data_ocorrido" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Pessoas envolvidas</label>
            <input name="envolvidos" placeholder="Nomes, cargos" className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Relato detalhado <span className="text-red-600">*</span>
            </label>
            <textarea
              name="relato"
              required
              rows={8}
              className="mt-1 w-full rounded-xl border px-3 py-2"
              placeholder="Descreva o fato, com datas, horários, local, serviços, valores, etc."
            ></textarea>
          </div>

          {/* Anexos */}
          <div>
            <label className="block text-sm font-medium">Anexos (PDF, JPG, PNG) — até 5 arquivos / 5MB cada</label>
            <input type="file" name="anexos" multiple accept=".pdf,.jpg,.jpeg,.png" className="mt-1" />
          </div>

          {/* LGPD */}
          <div className="flex items-start gap-3">
            <input id="lgpd" type="checkbox" name="lgpd" required className="mt-1 h-4 w-4" />
            <label htmlFor="lgpd" className="text-sm">
              Li e aceito a <button type="button" onClick={() => setShowPolicy(true)} className="underline">política de privacidade</button> e autorizo o uso dos dados para análise da manifestação.
            </label>
          </div>

          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{err}</div>
          )}
          {ok && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{ok}</div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button type="reset" className="rounded-xl border px-4 py-2">
              Limpar
            </button>
            <button disabled={submitting} className="rounded-xl bg-black px-5 py-2 text-white disabled:opacity-60">
              {submitting ? "Enviando…" : "Enviar manifestação"}
            </button>
          </div>
        </form>

        <div className="mt-10 text-sm text-gray-700 space-y-2">
          <p><strong>Koerner Tabelionato de Notas e Protesto</strong></p>
          <p>Rua José Cardoso de Lima, 1230, Centro<br/>Luis Eduardo Magalhães‑BA – CEP: 47850‑003</p>
          <p>Tel: (77) 3628‑1979 / (77) 3022‑2931</p>
          <p>Horário de Atendimento: Segunda à Sexta 08:00 - 16:00</p>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Em caso de indícios de ilícitos, a ouvidoria pode resguardar o sigilo e solicitar complementações. Denúncias anônimas podem limitar o retorno.
        </p>
      </div>
    {/* Modal – Política de Privacidade */}
      {showPolicy && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowPolicy(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="text-lg font-semibold">Política de Privacidade</h3>
                <button
                  type="button"
                  onClick={() => setShowPolicy(false)}
                  className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                  aria-label="Fechar política de privacidade"
                >
                  Fechar
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto p-4 text-sm leading-relaxed text-gray-800 space-y-4">
                <p><strong>INTRODUÇÃO</strong><br/>
                Nós, do Tabelionato Koerner de Notas e Protesto de Luís Eduardo Magalhães, atuamos em plena consonância com a Lei Geral de Proteção de Dados – LGPD (Lei Federal nº 13.709/2018), e atos normativos respectivos, em especial o Provimento Conjunto CGJ/CCI nº 03/2021 e Aviso Circular Conjunto nº CGJ/CCI-11/2021 do Tribunal de Justiça do Estado da Bahia, sendo nosso compromisso zelar pela proteção de dados pessoais com fundamento no respeito à privacidade, à autodeterminação informativa, à liberdade de expressão, informação, comunicação e opinião, à inviolabilidade da intimidade, da honra e da imagem, e dos direitos humanos.</p>
                <p>Neste sentido, destacamos que todos os dados pessoais recebidos no exercício do nosso serviço público visam a dar substrato para qualificação, lavratura, correção e arquivamento dos atos notariais e de protesto, do que desenvolvemos a presente POLÍTICA DE PRIVACIDADE para demonstrar o nosso compromisso com a valorização da privacidade e da proteção dos dados pessoais dos nossos usuários.</p>
                <p>Esta POLÍTICA DE PRIVACIDADE tem por objetivo além de estabelecer o programa interno de governança em privacidade (anexo I), o plano de resposta a incidente de segurança (anexo II), visa informar, de forma transparente e segura, como os dados pessoais coletados serão tratados, compartilhados e armazenados para organização e realização da nossa atividade notarial e de protesto.</p>
                <p>Esta POLÍTICA foi idealizada pela Tabeliã de Notas e Protesto de Luís Eduardo Magalhães com a finalidade de adequar suas atividades institucionais com a legislação referente à privacidade e proteção de dados pessoais no Brasil, especificamente a Lei Federal nº 13.709/18 (LGPD), assim como outras leis e normas estaduais da Bahia. Buscamos redigir a presente POLÍTICA DE PRIVACIDADE de modo simples e acessível para que você, usuário do nosso serviço, possa compreender o tratamento realizado, a sua finalidade, adequação e necessidade frente aos dados pessoais coletados no exercício da nossa atividade.</p>
                <p>Dessa forma, ao acessar nosso site ou utilizar nossos serviços, solicitamos que você faça a leitura dessa POLÍTICA para que possa compreender as práticas relacionadas à proteção de seus dados pessoais praticadas pelo Tabelionato de Notas e Protesto de Luís Eduardo Magalhães.</p>

                <p><strong>COLETA DOS DADOS PESSOAIS</strong><br/>
                Dados pessoais são todas as informações relacionadas as pessoas naturais identificadas ou identificáveis (art. 5º, I, LGPD) que são coletados por este Tabelionato através da utilização do nosso serviço presencial ou eletrônico por meio do nosso site ou canais eletrônicos de comunicação. Tais informações são fornecidas por você, usuário do nosso serviço, ao enviar uma mensagem, ou a fornecer um documento, por exemplo.</p>

                <p><strong>TRATAMENTO DOS DADOS PESSOAIS</strong><br/>
                O tratamento dos dados pessoais configura-se como toda operação de coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle de informação dos dados pessoais (art. 5º, X, LGPD). No âmbito do Tabelionato Koerner tal tratamento é realizado pelos prepostos/colaboradores do serviço notarial e de protesto de forma a cumprir às obrigações legais (Lei Federal nº 6.015/73, Lei Federal nº 8.935/94 e Lei Federal nº 9.492/97), às determinações de ordem de autoridades públicas e às requisições particulares de certidões.</p>

                <p><strong>FINALIDADE, ADEQUAÇÃO E NECESSIDADE DO TRATAMENTO</strong><br/>
                O Tabelionato Koerner exerce a atividade de tratamento dos atos pessoais com única e exclusiva finalidade de cumprir as prescrições normativas, especialmente insculpidas nas Leis Federais de nº 6.015/73, 8.935/94 e 9.492/97. No âmbito notarial o Koerner atua para formalizar juridicamente da vontade das partes, para intervir nos atos e negócios jurídicos para dar forma legal, para autenticar fatos, para lavrar escrituras e procurações públicas, para lavrar testamentos públicos e aprovar os cerrados, para lavrar atas notariais, para reconhecer firmas e para autenticar cópias. No âmbito do protesto a atuação refere-se à promoção da lavratura e do registro do protesto de títulos e outros documentos de dívida, garantindo a sua publicidade, conquanto realizando os atos e procedimentos necessários e/ou dele decorrentes.</p>
                <p>A realização do tratamento dos dados pessoais pelo Tabelionato Koerner espelha propósitos legítimos, específicos, explícitos e transparente ao titular, amparado no art. 7º, II e X, LGPD. Assim, realiza este Tabelionato adequação da atividade de tratamento de dados pessoais com a finalidade exigida em lei, bem como limita-se a realização do tratamento ao mínimo necessário para realização de sua finalidade, consoante depreende-se do binômio adequação-necessidade da atividade de tratamento (art. 6º, I, II e III, LGPD).</p>
                <p>Caso você deseje obter mais informações sobre a finalidade, a adequação e a necessidade acima citadas ou sobre quaisquer outras informações quanto o tratamento dos seus dados pessoais, poderá entrar em contato com o encarregado do Tabelionato Koerner através do e-mail: <a href="mailto:abrante.marques@koerner.com.br" className="underline">abrante.marques@koerner.com.br</a> e pelo contato telefônico (77) 3628-1979.</p>

                <p><strong>COMPARTILHAMENTO DE DADOS</strong><br/>
                Por vezes, os dados pessoais são compartilhados com órgãos e entidades públicas, governamentais, com centrais nacionais e estaduais mantidas pela entidade de classe e entidades representativas da indústria e comércio ou aquelas vinculadas à proteção do crédito, nos estritos limites legais. Esse compartilhamento será limitado ao mínimo necessário à finalidade específica.</p>

                <p><strong>ARMAZENAMENTO DE DADOS</strong><br/>
                Os dados pessoais tratados são mantidos conforme a tabela de temporalidade prevista no Provimento nº 50 do CNJ, por prazos necessários ao cumprimento das finalidades legais. Quando possível e permitido, a inutilização de documentos impede a identificação dos dados pessoais neles contidos.</p>

                <p><strong>SEGURANÇA NO TRATAMENTO E ARMAZENAMENTO</strong><br/>
                Adotamos medidas técnicas e administrativas para proteção de dados, alinhadas ao Provimento nº 74/CNJ, assegurando integridade, disponibilidade e confidencialidade.</p>

                <p><strong>DIREITOS DOS TITULARES</strong><br/>
                São assegurados os direitos previstos na LGPD: confirmação e acesso, correção, entre outros, por procedimentos previstos na legislação específica.</p>

                <p><strong>ENCARREGADO</strong><br/>
                Canal de contato: <a href="mailto:abrante.marques@koerner.com.br" className="underline">abrante.marques@koerner.com.br</a> | (77) 3628‑1979.</p>

                <p><strong>CONSIDERAÇÕES FINAIS</strong><br/>
                Podemos atualizar esta Política periodicamente para refletir melhorias e conformidade legal.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ============================================================================
app/api/ouvidoria/route.ts  (Server route – copy this into your project file)
============================================================================ */
/*
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = process.env.OUVIDORIA_TO_EMAIL; // destino

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

    const { error } = await resend.emails.send({
      from: process.env.OUVIDORIA_FROM_EMAIL || "ouvidoria@seu-dominio.vercel.app",
      to: TO,
      subject: assunto,
      html,
      reply_to: email || undefined,
      attachments: attachments.length
        ? attachments.map((a) => ({ filename: a.filename, content: a.content }))
        : undefined,
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
