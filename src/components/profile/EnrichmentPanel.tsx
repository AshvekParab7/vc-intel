"use client";

import { useEnrich } from "@/hooks/useEnrich";
import EnrichmentResultDisplay from "@/components/profile/EnrichmentResult";
import type { Company } from "@/lib/types";

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function EnrichmentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-3 w-24 rounded bg-zinc-200" />
      <div className="space-y-2 rounded-lg bg-zinc-100 p-4">
        <div className="h-3 rounded bg-zinc-200" />
        <div className="h-3 w-4/5 rounded bg-zinc-200" />
        <div className="h-3 w-3/5 rounded bg-zinc-200" />
      </div>
      <div className="space-y-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-zinc-200" />
            <div className="h-3 flex-1 rounded bg-zinc-200" />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {[60, 80, 50, 70, 90].map((w) => (
          <div key={w} className="h-5 rounded-full bg-zinc-200" style={{ width: w }} />
        ))}
      </div>
    </div>
  );
}

// ─── Idle state ───────────────────────────────────────────────────────────────

function EnrichmentIdle({
  company,
  onEnrich,
}: {
  company: Company;
  onEnrich: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2563eb"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </div>
      <p className="text-sm font-medium text-zinc-900">No enrichment yet</p>
      <p className="mt-1 max-w-[200px] text-xs text-zinc-500">
        Scrape {company.website.replace(/^https?:\/\//, "")} to extract
        signals, keywords, and a summary.
      </p>
      <button
        onClick={onEnrich}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        Enrich company
      </button>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function EnrichmentError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-100 bg-red-50 p-4">
      <div className="flex items-start gap-2.5">
        <svg
          className="mt-0.5 shrink-0 text-red-500"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-red-700">Enrichment failed</p>
          <p className="mt-0.5 text-xs text-red-600 break-words">{message}</p>
        </div>
      </div>
      <button
        onClick={onRetry}
        className="mt-3 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function EnrichmentPanel({ company }: { company: Company }) {
  const { status, result, error, enrich, clearCache } = useEnrich(
    company.website,
    company.id
  );

  return (
    <section className="lg:sticky lg:top-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Intelligence
        </h2>
        {status === "success" && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Enriched
          </span>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        {status === "idle" && (
          <EnrichmentIdle company={company} onEnrich={enrich} />
        )}

        {status === "loading" && <EnrichmentSkeleton />}

        {status === "error" && error && (
          <EnrichmentError message={error} onRetry={enrich} />
        )}

        {status === "success" && result && (
          <EnrichmentResultDisplay result={result} onClear={clearCache} />
        )}
      </div>
    </section>
  );
}
