"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { companies } from "@/lib/data/companies";
import { getSectorColor, getStageColor } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import OverviewSection from "@/components/profile/OverviewSection";
import SignalsTimeline from "@/components/profile/SignalsTimeline";
import NotesSection from "@/components/profile/NotesSection";
import SaveToListButton from "@/components/lists/SaveToListButton";
import EnrichmentResultDisplay from "@/components/profile/EnrichmentResult";
import type { EnrichmentResult } from "@/lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const ENRICHMENT_KEY_PREFIX = "enrichment-";

// ─── Helpers Components ───────────────────────────────────────────────────────

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
    </div>
  );
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function CompanyProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const company = companies.find((c) => c.id === id);

  // 1. Add state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrichment, setEnrichment] = useState<EnrichmentResult | null>(null);

  // 7. On page load, check cache and auto-load
  useEffect(() => {
    if (!company) return;
    const cached = localStorage.getItem(`${ENRICHMENT_KEY_PREFIX}${company.id}`);
    if (cached) {
      try {
        setEnrichment(JSON.parse(cached));
      } catch (err) {
        console.error("Failed to parse cached enrichment", err);
        localStorage.removeItem(`${ENRICHMENT_KEY_PREFIX}${company.id}`);
      }
    }
  }, [company]);

  if (!company) {
    notFound();
    return null;
  }

  // 2. Update handleEnrich function
  async function handleEnrich(force = false) {
    setLoading(true);
    setError(null);

    try {
      const cacheKey = `${ENRICHMENT_KEY_PREFIX}${company!.id}`;

      // Check localStorage first unless forcing update
      if (!force) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setEnrichment(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      // Call API
      const response = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: company!.website }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to enrich company data");
      }

      const result = await response.json();

      // Save result in state and localStorage
      setEnrichment(result);
      localStorage.setItem(cacheKey, JSON.stringify(result));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  function handleClearEnrichment() {
    if (company) {
      localStorage.removeItem(`${ENRICHMENT_KEY_PREFIX}${company.id}`);
      setEnrichment(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/companies"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
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
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Companies
      </Link>

      {/* Company header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          {/* Logo placeholder */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-lg font-bold text-zinc-700 shadow-sm">
            {company.name.charAt(0)}
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              {company.name}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge
                label={company.sector}
                className={getSectorColor(company.sector)}
              />
              <Badge
                label={company.stage}
                className={getStageColor(company.stage)}
              />
              <span className="text-xs text-zinc-400">{company.location}</span>
              <span className="text-zinc-300">·</span>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                {company.website.replace(/^https?:\/\//, "")}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:shrink-0">
          <SaveToListButton companyId={company.id} />
        </div>
      </div>

      {/* Body: 2-col layout → stacked on mobile */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <OverviewSection company={company} />
          <SignalsTimeline />
          <NotesSection companyId={company.id} />
        </div>

        {/* Right column — Intelligence panel */}
        <div className="lg:col-span-1">
          <section className="lg:sticky lg:top-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Intelligence
              </h2>
              {enrichment && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Enriched
                </span>
              )}
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              {!enrichment && !loading ? (
                // ─── Idle State ───────────────────────────────────────────────
                <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 px-6 py-10 text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-200">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#a1a1aa"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12H3M21 6H3M21 18H3" />
                      <circle cx="12" cy="12" r="3" stroke="#2563eb" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    No enrichment yet
                  </h3>
                  <p className="mt-1 max-w-xs text-xs text-zinc-500">
                    Click Enrich to fetch live signals from public web sources.
                  </p>

                  <button
                    onClick={() => handleEnrich(false)}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    Enrich
                  </button>

                  {error && (
                    <div className="mt-4 w-full rounded-lg border border-red-200 bg-red-50 p-3 text-left">
                      <p className="text-xs font-medium text-red-800">
                        Enrichment failed
                      </p>
                      <p className="mt-0.5 text-xs text-red-600">{error}</p>
                    </div>
                  )}
                </div>
              ) : loading ? (
                // ─── Loading State ────────────────────────────────────────────
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="mb-4 w-full">
                    <EnrichmentSkeleton />
                  </div>
                  <button
                    disabled
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-100 px-4 py-2.5 text-sm font-medium text-blue-700 cursor-not-allowed opacity-80"
                  >
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Fetching public signals...
                  </button>
                </div>
              ) : enrichment ? (
                // ─── Success State ────────────────────────────────────────────
                <div className="flex flex-col gap-4">
                  <EnrichmentResultDisplay
                    result={enrichment}
                    onClear={handleClearEnrichment}
                  />
                  <div className="border-t border-zinc-100 pt-4">
                    <button
                      onClick={() => handleEnrich(true)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
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
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                      </svg>
                      Re-run enrichment
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
