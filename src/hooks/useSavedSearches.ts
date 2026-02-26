"use client";

import { useState } from "react";
import { getItem, setItem } from "@/lib/localStorage";
import type { SavedSearch, CompanyFilters } from "@/lib/types";

// ─── Storage key ──────────────────────────────────────────────────────────────

const KEY = "vc_saved_searches";

// ─── Return type ─────────────────────────────────────────────────────────────

export interface UseSavedSearchesReturn {
  searches: SavedSearch[];
  saveSearch: (name: string, filters: CompanyFilters) => void;
  deleteSearch: (id: string) => void;
  buildUrl: (filters: CompanyFilters) => string;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSavedSearches(): UseSavedSearchesReturn {
  const [searches, setSearches] = useState<SavedSearch[]>(
    () => getItem<SavedSearch[]>(KEY) ?? []
  );

  function persist(updated: SavedSearch[]) {
    setSearches(updated);
    setItem(KEY, updated);
  }

  function saveSearch(name: string, filters: CompanyFilters) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const search: SavedSearch = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: trimmed,
      filters,
      createdAt: new Date().toISOString(),
    };
    persist([search, ...searches]);
  }

  function deleteSearch(id: string) {
    persist(searches.filter((s) => s.id !== id));
  }

  /**
   * Converts a CompanyFilters object into a /companies URL query string.
   * Only non-empty values are included.
   */
  function buildUrl(filters: CompanyFilters): string {
    const params = new URLSearchParams();
    if (filters.query) params.set("q", filters.query);
    if (filters.sector) params.set("sector", filters.sector);
    if (filters.stage) params.set("stage", filters.stage);
    if (filters.location) params.set("location", filters.location);
    const qs = params.toString();
    return `/companies${qs ? `?${qs}` : ""}`;
  }

  return { searches, saveSearch, deleteSearch, buildUrl };
}
