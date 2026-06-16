import useSWR from "swr";

export interface ContextPack {
  recentTurns: Array<{ role: "user" | "assistant"; content: string }>;
  summaryRef: string | null;
  memoryRefs: string[];
  isLoading: boolean;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  timestamp: Date;
}

interface UseContextPackOptions {
  messages: Message[];
  conversationId?: string;
}

const WINDOW_SIZE = 8;

async function fetchContextPack(
  turns: Array<{ role: "user" | "assistant"; content: string }>,
  conversationId: string
): Promise<{ recentTurns: Array<{ role: "user" | "assistant"; content: string }>; summaryRef: string | null; memoryRefs: string[] }> {
  const res = await fetch("/api/context-pack", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ turns, conversationId }),
  });
  if (!res.ok) {
    throw new Error(`context-pack error ${res.status}`);
  }
  return res.json();
}

export function useContextPack({
  messages,
  conversationId = "global",
}: UseContextPackOptions): ContextPack {
  // Build SWR key from the last 8 message ids so it refetches when messages change
  const lastWindow = messages.slice(-WINDOW_SIZE);
  const keyIds = lastWindow.map((m) => m.id).join(",");
  const swrKey = messages.length > 0 ? `context-pack:${conversationId}:${keyIds}` : null;

  // Map full Message objects to slim { role, content } turns
  const turns = messages.map((m) => ({ role: m.role, content: m.content }));

  const { data, isLoading } = useSWR(
    swrKey,
    () => fetchContextPack(turns, conversationId),
    {
      dedupingInterval: 30_000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );

  if (!data) {
    return {
      recentTurns: turns.slice(-WINDOW_SIZE),
      summaryRef: null,
      memoryRefs: [],
      isLoading,
    };
  }

  return {
    recentTurns: data.recentTurns,
    summaryRef: data.summaryRef,
    memoryRefs: data.memoryRefs,
    isLoading,
  };
}
