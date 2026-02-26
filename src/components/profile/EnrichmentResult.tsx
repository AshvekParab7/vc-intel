import type { EnrichmentResult } from "@/lib/types";

// ─── Sub-sections ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
      {children}
    </h3>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function EnrichmentResultDisplay({
  result,
  onClear,
}: {
  result: EnrichmentResult;
  onClear: () => void;
}) {
  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-zinc-500">
            Enriched{" "}
            <span className="text-zinc-400">
              {new Date(result.enrichedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </p>
        </div>
        <button
          onClick={onClear}
          className="text-[11px] text-zinc-400 hover:text-zinc-600 underline transition-colors"
        >
          Re-enrich
        </button>
      </div>

      {/* Summary */}
      <div>
        <SectionLabel>Summary</SectionLabel>
        <div className="rounded-lg border-l-[3px] border-blue-400 bg-blue-50/60 px-4 py-3">
          <p className="text-sm leading-relaxed text-zinc-700">
            {result.summary}
          </p>
        </div>
      </div>

      {/* What they do */}
      <div>
        <SectionLabel>What they do</SectionLabel>
        <ul className="space-y-1.5">
          {result.whatTheyDo.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-600">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Keywords */}
      <div>
        <SectionLabel>Keywords</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {result.keywords.map((kw) => (
            <span
              key={kw}
              className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Derived signals */}
      <div>
        <SectionLabel>Derived signals</SectionLabel>
        <ul className="space-y-2">
          {result.signals.map((signal, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5"
            >
              <svg
                className="mt-0.5 shrink-0 text-amber-500"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="text-xs leading-relaxed text-zinc-700">
                {signal}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sources */}
      <div>
        <SectionLabel>Sources</SectionLabel>
        <ul className="space-y-1.5">
          {result.sources.map((source, i) => (
            <li key={i} className="flex items-center justify-between gap-3">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center gap-1.5 text-xs text-blue-600 hover:underline"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span className="truncate">{source.url.replace(/^https?:\/\//, "")}</span>
              </a>
              <span className="shrink-0 text-[10px] text-zinc-400">
                {new Date(source.timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
