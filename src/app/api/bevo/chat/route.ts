import { NextResponse } from "next/server";
import { B3VO_SYSTEM_PROMPT } from "../prompt";

/**
 * Same-origin chat proxy for the embedded B3VO web app, in the same spirit as
 * /api/tts: the OpenAI key lives here instead of in the public web bundle.
 *
 * The endpoint is unauthenticated because the demo is, so it is deliberately
 * narrow — the system prompt is fixed server-side, the model and token budget
 * are pinned, payloads are capped, and callers are rate limited by IP. It can
 * only ever behave as Bevo, never as a free general-purpose completion API.
 */

const MODEL = "gpt-4.1";
const MAX_TOKENS = 400;
const MAX_MESSAGES = 40;
const MAX_CHARS = 8_000; // total text across the conversation
const MAX_MEMORY_CHARS = 2_000;
const MAX_IMAGE_CHARS = 7_000_000; // ~5 MB of base64

const RATE_LIMIT = 20; // requests per IP
const RATE_WINDOW_MS = 60_000;

type TextPart = { type: "text"; text: string };
type ImagePart = { type: "image_url"; image_url: { url: string } };
type Part = TextPart | ImagePart;
type Msg = { role: "user" | "assistant"; content: string | Part[] };

const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT;
}

/** Drop anything that isn't a plain user/assistant turn Bevo could have produced. */
function sanitize(raw: unknown): Msg[] {
  if (!Array.isArray(raw)) return [];
  const out: Msg[] = [];
  let budget = MAX_CHARS;
  let images = 0;

  for (const item of raw.slice(-MAX_MESSAGES)) {
    if (!item || typeof item !== "object") continue;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") continue;

    if (typeof content === "string") {
      const text = content.slice(0, budget);
      if (!text) continue;
      budget -= text.length;
      out.push({ role, content: text });
      continue;
    }

    if (!Array.isArray(content)) continue;
    const parts: Part[] = [];
    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const p = part as { type?: unknown; text?: unknown; image_url?: unknown };
      if (p.type === "text" && typeof p.text === "string") {
        const text = p.text.slice(0, budget);
        if (!text) continue;
        budget -= text.length;
        parts.push({ type: "text", text });
      } else if (p.type === "image_url" && images < 1) {
        const url = (p.image_url as { url?: unknown })?.url;
        if (typeof url !== "string") continue;
        if (!url.startsWith("data:image/")) continue; // no server-side fetches (SSRF)
        if (url.length > MAX_IMAGE_CHARS) continue;
        images += 1;
        parts.push({ type: "image_url", image_url: { url } });
      }
    }
    if (parts.length) out.push({ role, content: parts });
  }

  return out;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Slow down" }, { status: 429 });
  }

  let payload: { messages?: unknown; memory?: unknown; max_tokens?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const messages = sanitize(payload.messages);
  if (!messages.length) {
    return NextResponse.json({ error: "Missing messages" }, { status: 400 });
  }

  const memory =
    typeof payload.memory === "string" ? payload.memory.slice(0, MAX_MEMORY_CHARS).trim() : "";
  const maxTokens = Math.min(
    Math.max(Number(payload.max_tokens) || 150, 1),
    MAX_TOKENS,
  );

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Chat not configured" }, { status: 500 });

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        {
          role: "system",
          content: memory ? `${B3VO_SYSTEM_PROMPT}\n\n${memory}` : B3VO_SYSTEM_PROMPT,
        },
        ...messages,
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("OpenAI error:", res.status, detail.slice(0, 300));
    return NextResponse.json({ error: "Chat failed" }, { status: 502 });
  }

  const data = await res.json();
  const content: string = data.choices?.[0]?.message?.content ?? "";

  // Mirror the OpenAI response shape the app already parses.
  return NextResponse.json(
    { choices: [{ message: { content } }] },
    { headers: { "Cache-Control": "no-store" } },
  );
}
