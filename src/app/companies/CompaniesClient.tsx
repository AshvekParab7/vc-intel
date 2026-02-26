"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyFilters } from "@/hooks/useCompanyFilters";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import CompanyFilters from "@/components/companies/CompanyFilters";
import CompanyTable from "@/components/companies/CompanyTable";
import EmptyState from "@/components/ui/EmptyState";
import type { SortField } from "@/lib/types";

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  pageCount: number;
  totalCount: number;
  onPage: (p: number) => void;
}

function Pagination({ page, pageCount, totalCount, onPage }: PaginationProps) {
  const PAGE_SIZE = 10;
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalCount);

  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-zinc-100 bg-white px-4 py-3 rounded-b-xl -mt-px">
      <p className="text-xs text-zinc-500">
        Showing{" "}
        <span className="font-medium text-zinc-700">{from}–{to}</span>{" "}
        of{" "}
        <span className="font-medium text-zinc-700">{totalCount}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={[
              "flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-colors",
              p === page
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50",
            ].join(" ")}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === pageCount}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Save search inline form ──────────────────────────────────────────────────

interface SaveSearchFormProps {
  onSave: (name: string) => void;
  onCancel: () => void;
}

function SaveSearchForm({ onSave, onCancel }: SaveSearchFormProps) {
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) onSave(name.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name this search…"
        className="h-8 rounded-md border border-blue-300 bg-white px-3 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-blue-100"
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:bg-zinc-200 disabled:text-zinc-500 transition-colors"
      >
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
      >
        Cancel
      </button>
    </form>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CompaniesClient() {
  const searchParams = useSearchParams();

  // Read all filter params from URL (enables "Run saved search" to work)
  const initialFilters = {
    // Read from 'query' first, fallback to 'q' for backward compatibility
    query: searchParams.get("query") ?? searchParams.get("q") ?? "",
    sector: searchParams.get("sector") ?? "",
    stage: searchParams.get("stage") ?? "",
    location: searchParams.get("location") ?? "",
  };

  const {
    query, setQuery,
    sector, setSector,
    stage, setStage,
    location, setLocation,
    sortBy, sortDir,
    page, setPage,
    toggleSort,
    clearFilters,
    results,
    totalCount,
    pageCount,
    sectorOptions,
    stageOptions,
    locationOptions,
    hasActiveFilters,
  } = useCompanyFilters(initialFilters);

  const { saveSearch } = useSavedSearches();
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  function handleSaveSearch(name: string) {
    saveSearch(name, {
      query,
      sector,
      stage,
      location,
      sortBy: sortBy as SortField,
      sortDir,
    });
    setShowSaveForm(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Companies
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Browse, search, and filter the startup database.
          </p>
        </div>

        {/* Save search action */}
        <div className="flex items-center gap-2 shrink-0">
          {savedFlash ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Search saved
            </span>
          ) : showSaveForm ? (
            <SaveSearchForm
              onSave={handleSaveSearch}
              onCancel={() => setShowSaveForm(false)}
            />
          ) : (
            hasActiveFilters && (
              <button
                onClick={() => setShowSaveForm(true)}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                Save search
              </button>
            )
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <CompanyFilters
          query={query}
          sector={sector}
          stage={stage}
          location={location}
          totalCount={totalCount}
          sectorOptions={sectorOptions}
          stageOptions={stageOptions}
          locationOptions={locationOptions}
          hasActiveFilters={hasActiveFilters}
          onQueryChange={setQuery}
          onSectorChange={setSector}
          onStageChange={setStage}
          onLocationChange={setLocation}
          onClear={clearFilters}
        />
      </div>

      {/* Table or empty state */}
      {results.length > 0 ? (
        <>
          <CompanyTable
            companies={results}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={toggleSort}
          />
          <Pagination
            page={page}
            pageCount={pageCount}
            totalCount={totalCount}
            onPage={setPage}
          />
        </>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <EmptyState
            title="No companies found"
            description={
              hasActiveFilters
                ? "No companies match your current filters. Try adjusting your search."
                : "No companies in the database yet."
            }
            action={
              hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
                >
                  Clear filters
                </button>
              ) : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
