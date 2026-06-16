import { NextResponse } from "next/server";

const FALLBACK_STATUS = {
  clients: [
    { id: "shell", name: "OMNIS Calm Shell", lastEventId: "evt_001", connected: true, lag: 0 },
    { id: "kratos", name: "KRATOS Cockpit", lastEventId: "evt_001", connected: false, lag: null },
    { id: "cli", name: "OMNIS CLI", lastEventId: "evt_000", connected: false, lag: 2 },
  ],
  streamId: "omnis-main-stream",
  totalEvents: 127,
  lastEventId: "evt_001",
};

export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch("http://localhost:8765/sync/status", {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(FALLBACK_STATUS);
  }
}

export async function POST() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch("http://localhost:8765/sync/force", {
      method: "POST",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ ok: true, message: "Sync forçado (mock)" });
  }
}
