// ─── Company ─────────────────────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  sector: string;
  stage: string;
  location: string;
  website: string;
  description?: string;
  founded?: string;
  employees?: string;
  revenue?: string;
}

// ─── Enrichment ──────────────────────────────────────────────────────────────

export interface EnrichmentSource {
  url: string;
  timestamp: string;
}

export interface EnrichmentResult {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  signals: string[];
  sources: EnrichmentSource[];
  enrichedAt: string;
}

// ─── Notes ───────────────────────────────────────────────────────────────────

export interface Note {
  id: string;
  companyId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Lists ───────────────────────────────────────────────────────────────────

export interface CompanyList {
  id: string;
  name: string;
  companyIds: string[];
  createdAt: string;
}

// ─── Saved Searches ──────────────────────────────────────────────────────────

export interface SavedSearch {
  id: string;
  name: string;
  filters: CompanyFilters;
  createdAt: string;
}

export interface CompanyFilters {
  query: string;
  sector: string;
  stage: string;
  location: string;
  sortBy: SortField;
  sortDir: "asc" | "desc";
}

export type SortField = "name" | "sector" | "stage" | "location";
