"use client";

import Link from "next/link";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import EmptyState from "@/components/ui/EmptyState";
import type { SavedSearch } from "@/lib/types";

// ─── Filter pill ──────────────────────────────────────────────────────────────

function FilterPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px]">
      <span className="font-medium text-zinc-400">{label}</span>
      <span className="text-zinc-600">{value}</span>
    </span>
  );
}

// ─── Search card ──────────────────────────────────────────────────────────────

interface SearchCardProps {
  search: SavedSearch;
  runUrl: string;
  onDelete: (id: string) => void;
}

function SearchCard({ search, runUrl, onDelete }: SearchCardProps) {
  const { filters } = search;

  // Collect active filter pills
  const pills: { label: string; value: string }[] = [];
  if (filters.query) pills.push({ label: "search", value: filters.query });
  if (filters.sector) pills.push({ label: "sector", value: filters.sector });
  if (filters.stage) pills.push({ label: "stage", value: filters.stage });
  if (filters.location) pills.push({ label: "location", value: filters.location });

  const createdDate = new Date(search.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-zinc-900">{search.name}</h3>
          <p className="mt-0.5 text-[11px] text-zinc-400">Saved {createdDate}</p>
        </div>
        <button
          onClick={() => onDelete(search.id)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
          title="Delete saved search"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>

      {/* Filter pills */}
      {pills.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pills.map((p) => (
            <FilterPill key={p.label} label={p.label} value={p.value} />
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-zinc-400 italic">No filters applied</p>
      )}

      {/* Run search */}
      <div className="mt-4 border-t border-zinc-100 pt-3">
        <Link
          href={runUrl}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Run search
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SavedPage() {
  const { searches, deleteSearch, buildUrl } = useSavedSearches();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Saved Searches
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Re-run filtered searches without rebuilding them from scratch.
        </p>
      </div>

      {/* Tip banner — only shows when searches exist */}
      {searches.length > 0 && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3">
          <svg className="mt-0.5 shrink-0 text-blue-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <p className="text-xs text-blue-700">
            Searches are saved locally in your browser. To save a new search, apply filters on the{" "}
            <Link href="/companies" className="font-medium underline hover:no-underline">
              Companies
            </Link>{" "}
            page and click <strong>Save search</strong>.
          </p>
        </div>
      )}

      {/* Grid or empty state */}
      {searches.length === 0 ? (
        <EmptyState
          title="No saved searches"
          description="Apply filters on the Companies page, then click 'Save search' to save them here."
          action={
            <Link
              href="/companies"
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Go to Companies
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {searches.map((search) => (
            <SearchCard
              key={search.id}
              search={search}
              runUrl={buildUrl(search.filters)}
              onDelete={deleteSearch}
            />
          ))}
        </div>
      )}
    </div>
  );
}
