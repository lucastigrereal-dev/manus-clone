import { NextRequest } from "next/server";

const LITELLM_BASE = "http://localhost:4001/v1";

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

  const messages = [
    { role: "system" as const, content: systemContent },
    ...history.slice(-10).map((h: { role: string; content: string }) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    })),
    { role: "user" as const, content: message },
  ];

  try {
    const response = await fetch(`${LITELLM_BASE}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, stream: true, max_tokens: 4096 }),
    });

    if (!response.ok) {
      const err = await response.text().catch(() => "Unknown error");
      return new Response(
        JSON.stringify({ error: `LiteLLM error: ${err}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) { controller.close(); return; }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (!data || data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const text = parsed.choices?.[0]?.delta?.content;
                if (text) controller.enqueue(new TextEncoder().encode(text));
              } catch {
                // ignora linhas malformadas
              }
            }
          }

          if (buffer) {
            for (const line of buffer.split("\n")) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (!data || data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const text = parsed.choices?.[0]?.delta?.content;
                if (text) controller.enqueue(new TextEncoder().encode(text));
              } catch {}
            }
          }
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "LiteLLM :4001 inacessível. Verifique se está rodando." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
