"use client";

import { useState, useMemo, useEffect } from "react";
import { companies as ALL } from "@/lib/data/companies";
import { sortCompanies, uniqueValues } from "@/lib/utils";
import type { Company, SortField } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CompanyFilterState {
  query: string;
  sector: string;
  stage: string;
  location: string;
  sortBy: SortField;
  sortDir: "asc" | "desc";
  page: number;
}

/** Pass any subset to seed the initial filter state (e.g. from URL params). */
export interface InitialFilters {
  query?: string;
  sector?: string;
  stage?: string;
  location?: string;
}

export interface UseCompanyFiltersReturn {
  // Filter state
  query: string;
  sector: string;
  stage: string;
  location: string;
  sortBy: SortField;
  sortDir: "asc" | "desc";
  page: number;
  // Setters
  setQuery: (v: string) => void;
  setSector: (v: string) => void;
  setStage: (v: string) => void;
  setLocation: (v: string) => void;
  setPage: (v: number) => void;
  toggleSort: (field: SortField) => void;
  clearFilters: () => void;
  // Derived data
  results: Company[];
  totalCount: number;
  pageCount: number;
  // Dropdown options
  sectorOptions: string[];
  stageOptions: string[];
  locationOptions: string[];
  // Helpers
  hasActiveFilters: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCompanyFilters(
  initial: InitialFilters = {}
): UseCompanyFiltersReturn {
  const [query, setQueryRaw] = useState(initial.query ?? "");
  const [sector, setSectorRaw] = useState(initial.sector ?? "");
  const [stage, setStageRaw] = useState(initial.stage ?? "");
  const [location, setLocationRaw] = useState(initial.location ?? "");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  // Reset page whenever filters change
  useEffect(() => {
    setPage(1);
  }, [query, sector, stage, location]);

  // Dropdown options derived from full dataset (not filtered)
  const sectorOptions = useMemo(() => uniqueValues(ALL, "sector"), []);
  const stageOptions = useMemo(() => uniqueValues(ALL, "stage"), []);
  const locationOptions = useMemo(() => uniqueValues(ALL, "location"), []);

  // Filtered list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        (c.description?.toLowerCase().includes(q) ?? false);
      const matchesSector = !sector || c.sector === sector;
      const matchesStage = !stage || c.stage === stage;
      const matchesLocation = !location || c.location === location;
      return matchesQuery && matchesSector && matchesStage && matchesLocation;
    });
  }, [query, sector, stage, location]);

  // Sorted list
  const sorted = useMemo(
    () => sortCompanies(filtered, sortBy, sortDir),
    [filtered, sortBy, sortDir]
  );

  // Paginated slice
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const results = sorted.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  function setQuery(v: string) { setQueryRaw(v); }
  function setSector(v: string) { setSectorRaw(v); }
  function setStage(v: string) { setStageRaw(v); }
  function setLocation(v: string) { setLocationRaw(v); }

  function toggleSort(field: SortField) {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
    setPage(1);
  }

  function clearFilters() {
    setQueryRaw("");
    setSectorRaw("");
    setStageRaw("");
    setLocationRaw("");
    setSortBy("name");
    setSortDir("asc");
    setPage(1);
  }

  return {
    query,
    sector,
    stage,
    location,
    sortBy,
    sortDir,
    page: safePage,
    setQuery,
    setSector,
    setStage,
    setLocation,
    setPage,
    toggleSort,
    clearFilters,
    results,
    totalCount: filtered.length,
    pageCount,
    sectorOptions,
    stageOptions,
    locationOptions,
    hasActiveFilters: !!(query || sector || stage || location),
  };
}
