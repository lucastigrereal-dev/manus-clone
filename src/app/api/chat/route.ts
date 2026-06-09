import { NextRequest } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

const modelMap: Record<string, string> = {
  aurora: "kimi-k2.6:cloud",
  hermes: "deepseek-v4-pro:cloud",
  vulcano: "qwen2.5-coder:7b",
  muse: "glm-5.1:cloud",
};

export async function POST(req: NextRequest) {
  const { message, agent = "aurora", history = [] } = await req.json();
  const model = modelMap[agent.toLowerCase()] || modelMap.aurora;

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

  const system = systemPrompts[agent.toLowerCase()] || systemPrompts.aurora;

  const messages = [
    { role: "system", content: system },
    ...history.slice(-10).map((h: any) => ({
      role: h.role,
      content: h.content,
    })),
    { role: "user", content: message },
  ];

  try {
    const response = await fetch(`${OLLAMA_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text().catch(() => "Unknown error");
      return new Response(
        JSON.stringify({ error: `Ollama error: ${err}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

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
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") {
                  continue; // skip SSE terminator
                }
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || "";
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                  }
                } catch {
                  // ignora linhas malformadas
                }
              }
            }
          }

          // Flush remaining buffer
          if (buffer) {
            for (const line of buffer.split("\n")) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || "";
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                  }
                } catch {
                  // ignora
                }
              }
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
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `Failed to connect to Ollama at ${OLLAMA_URL}. Ensure Ollama is running.`,
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}
