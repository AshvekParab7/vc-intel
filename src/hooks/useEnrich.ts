"use client";

import { useState } from "react";
import { getItem, setItem, removeItem } from "@/lib/localStorage";
import type { EnrichmentResult } from "@/lib/types";

// ─── Status type ─────────────────────────────────────────────────────────────

export type EnrichStatus = "idle" | "loading" | "success" | "error";

// ─── Return type ─────────────────────────────────────────────────────────────

export interface UseEnrichReturn {
  status: EnrichStatus;
  result: EnrichmentResult | null;
  error: string | null;
  enrich: () => Promise<void>;
  clearCache: () => void;
}

// ─── Key ─────────────────────────────────────────────────────────────────────

function storageKey(companyId: string) {
  return `vc-intel:enrichment:${companyId}`;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useEnrich(
  websiteUrl: string,
  companyId: string
): UseEnrichReturn {
  const key = storageKey(companyId);

  // Hydrate from cache on first render
  const cached = getItem<EnrichmentResult>(key);

  const [result, setResult] = useState<EnrichmentResult | null>(cached);
  const [status, setStatus] = useState<EnrichStatus>(
    cached ? "success" : "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function enrich() {
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: websiteUrl }),
      });

      // Try to parse body regardless of status to get error message
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          (data as { error?: string }).error ??
            `Request failed with status ${res.status}`
        );
      }

      const enriched = data as EnrichmentResult;
      setResult(enriched);
      setStatus("success");
      setItem(key, enriched);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setStatus("error");
    }
  }

  function clearCache() {
    removeItem(key);
    setResult(null);
    setStatus("idle");
    setError(null);
  }

  return { status, result, error, enrich, clearCache };
}
