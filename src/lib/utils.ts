import { Company, SortField } from "@/lib/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Pill colour based on sector name */
const SECTOR_COLORS: Record<string, string> = {
  Fintech: "bg-sky-50 text-sky-700 border border-sky-100",
  SaaS: "bg-violet-50 text-violet-700 border border-violet-100",
  EdTech: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  HealthTech: "bg-teal-50 text-teal-700 border border-teal-100",
  DeepTech: "bg-orange-50 text-orange-700 border border-orange-100",
  "E-commerce": "bg-pink-50 text-pink-700 border border-pink-100",
  Logistics: "bg-amber-50 text-amber-700 border border-amber-100",
  AgriTech: "bg-lime-50 text-lime-700 border border-lime-100",
};

const STAGE_COLORS: Record<string, string> = {
  "Pre-seed": "bg-zinc-100 text-zinc-600 border border-zinc-200",
  Seed: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  "Series A": "bg-blue-50 text-blue-700 border border-blue-200",
  "Series B": "bg-sky-50 text-sky-700 border border-sky-200",
  "Series C": "bg-purple-50 text-purple-700 border border-purple-200",
  "Series D": "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200",
  "Series E": "bg-rose-50 text-rose-700 border border-rose-200",
  "Series F": "bg-red-50 text-red-700 border border-red-200",
  Growth: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

export function getSectorColor(sector: string): string {
  return (
    SECTOR_COLORS[sector] ??
    "bg-zinc-100 text-zinc-600 border border-zinc-200"
  );
}

export function getStageColor(stage: string): string {
  return (
    STAGE_COLORS[stage] ??
    "bg-zinc-100 text-zinc-600 border border-zinc-200"
  );
}

/** Get unique sorted values for a given company field */
export function uniqueValues(
  companies: Company[],
  key: keyof Pick<Company, "sector" | "stage" | "location">
): string[] {
  return [...new Set(companies.map((c) => c[key]))].sort();
}

/** Sort a company array by a given field and direction */
export function sortCompanies(
  list: Company[],
  field: SortField,
  dir: "asc" | "desc"
): Company[] {
  return [...list].sort((a, b) => {
    const av = a[field].toLowerCase();
    const bv = b[field].toLowerCase();
    const cmp = av.localeCompare(bv);
    return dir === "asc" ? cmp : -cmp;
  });
}
