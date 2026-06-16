import { NextRequest } from "next/server";

const AURORA_BASE = "http://localhost:8766";

const systemPrompts: Record<string, string> = {
  aurora:
    "Você é Aurora, copiloto principal do OMNIS Calm Shell. Ajuda o usuário Lucas Tigre com criatividade, estratégia e execução. Responda em português do Brasil. Seja direta, útil e calma.",
  hermes:
    "Você é Hermes, agente de pesquisa do OMNIS. Especialista em análise de mercado, lead mining, Instagram analytics e deep research. Responda em português com dados e insights acionáveis.",
  vulcano:
    "Você é Vulcano, agente de desenvolvimento do OMNIS. Especialista em App Factory, automações, código, n8n, GitHub e infraestrutura. Responda em português com código limpo e explicações técnicas claras.",
  muse:
    "Você é Muse, agente criativo do OMNIS. Especialista em copywriting, design de Instagram, carrosséis, storytelling e conteúdo para turismo. Responda em português com ideias criativas e copy persuasiva.",
};

export async function POST(req: NextRequest) {
  const { message, agent = "aurora", model = "ollama-fast", history = [] } = await req.json();
  const systemContent = systemPrompts[agent.toLowerCase()] || systemPrompts.aurora;

  // Endpoint real do Core: POST /aurora/chat → {"response","status","model"}
  // Aurora é não-streaming — wrappamos a resposta como texto plano
  // para manter o contrato com o frontend sem alterar nenhum componente.
  try {
    const response = await fetch(`${AURORA_BASE}/aurora/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        agent,
        model,
        system_prompt: systemContent,
        history: history.slice(-10),
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`aurora ${response.status}`);
    }

    const data = await response.json();
    const text: string = data.response ?? "(Aurora sem resposta)";
    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Aurora :8766 inacessível. Core offline?" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
