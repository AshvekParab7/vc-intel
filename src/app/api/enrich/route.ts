import { NextRequest, NextResponse } from "next/server";

// ─── Constants ────────────────────────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 12_000;
const MAX_TEXT_CHARS = 15_000;

// ─── Types ────────────────────────────────────────────────────────────────────

interface EnrichPayload {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  signals: string[];
}

interface EnrichResponse extends EnrichPayload {
  sources: { url: string; timestamp: string }[];
  enrichedAt: string;
}

// ─── URL validation ───────────────────────────────────────────────────────────

function isValidUrl(input: string): boolean {
  try {
    const parsed = new URL(input);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// ─── HTML → plain text ────────────────────────────────────────────────────────

function extractText(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Simple Deterministic Extractor (Free) ───────────────────────────────────

function simpleExtract(url: string, text: string): EnrichPayload {
  const lower = text.toLowerCase();

  const keywords: string[] = [];
  const signals: string[] = [];

  if (lower.includes("api")) keywords.push("API");
  if (lower.includes("payments")) keywords.push("Payments");
  if (lower.includes("ai")) keywords.push("Artificial Intelligence");
  if (lower.includes("enterprise")) keywords.push("Enterprise");
  if (lower.includes("developer")) keywords.push("Developer Tools");
  if (lower.includes("platform")) keywords.push("Platform");
  if (lower.includes("saas")) keywords.push("SaaS");
  if (lower.includes("cloud")) keywords.push("Cloud");

  if (lower.includes("careers")) signals.push("Hiring activity visible");
  if (lower.includes("blog")) signals.push("Active content publishing");
  if (lower.includes("press")) signals.push("Press coverage detected");
  if (lower.includes("customers")) signals.push("Customer proof present");

  const truncated =
    text.length > MAX_TEXT_CHARS
      ? text.slice(0, MAX_TEXT_CHARS)
      : text;

  return {
    summary: truncated.slice(0, 220) + "...",
    whatTheyDo: [
      "Provides technology-driven solutions",
      "Serves businesses and developers",
      "Operates through a digital platform",
    ],
    keywords: keywords.slice(0, 8),
    signals: signals.slice(0, 4),
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: { url?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const rawUrl = body?.url;

  if (!rawUrl || typeof rawUrl !== "string" || !rawUrl.trim()) {
    return NextResponse.json(
      { error: "Missing required field: url (string)." },
      { status: 400 }
    );
  }

  const url = rawUrl.trim();

  if (!isValidUrl(url)) {
    return NextResponse.json(
      { error: "Invalid URL. Must be a valid http or https URL." },
      { status: 400 }
    );
  }

  // ── Fetch HTML ────────────────────────────────────────────────────────────

  let html: string;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; VCIntelBot/1.0; +https://vc-intel.app)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch the URL (HTTP ${res.status}).` },
        { status: 400 }
      );
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      return NextResponse.json(
        { error: "URL did not return an HTML page." },
        { status: 400 }
      );
    }

    html = await res.text();
  } catch (err) {
    clearTimeout(timeout);

    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: `Request timed out after ${FETCH_TIMEOUT_MS / 1000}s.` },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Could not reach the URL. Check it is publicly accessible." },
      { status: 400 }
    );
  } finally {
    clearTimeout(timeout);
  }

  // ── Extract Text ───────────────────────────────────────────────────────────

  const text = extractText(html);

  if (text.length < 100) {
    return NextResponse.json(
      { error: "Not enough readable content found on the page." },
      { status: 400 }
    );
  }

  // ── Deterministic Enrichment ──────────────────────────────────────────────

  const aiPayload = simpleExtract(url, text);

  const now = new Date().toISOString();

  const response: EnrichResponse = {
    ...aiPayload,
    sources: [{ url, timestamp: now }],
    enrichedAt: now,
  };

  return NextResponse.json(response, { status: 200 });
}