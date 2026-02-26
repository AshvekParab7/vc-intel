"use client";

import type { SortField } from "@/lib/types";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-zinc-400"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}

function FilterSelect({ value, onChange, options, placeholder }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={[
        "h-9 rounded-lg border border-zinc-200 bg-white px-3 pr-8 text-sm outline-none",
        "transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100",
        "appearance-none cursor-pointer",
        value ? "text-zinc-800 font-medium" : "text-zinc-400",
      ].join(" ")}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CompanyFiltersProps {
  query: string;
  sector: string;
  stage: string;
  location: string;
  totalCount: number;
  sectorOptions: string[];
  stageOptions: string[];
  locationOptions: string[];
  hasActiveFilters: boolean;
  onQueryChange: (v: string) => void;
  onSectorChange: (v: string) => void;
  onStageChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onClear: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CompanyFilters({
  query,
  sector,
  stage,
  location,
  totalCount,
  sectorOptions,
  stageOptions,
  locationOptions,
  hasActiveFilters,
  onQueryChange,
  onSectorChange,
  onStageChange,
  onLocationChange,
  onClear,
}: CompanyFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <IconSearch />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search companies…"
            className="h-9 w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-8 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          {query && (
            <button
              onClick={() => onQueryChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <IconX />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <FilterSelect
          value={sector}
          onChange={onSectorChange}
          options={sectorOptions}
          placeholder="Sector"
        />
        <FilterSelect
          value={stage}
          onChange={onStageChange}
          options={stageOptions}
          placeholder="Stage"
        />
        <FilterSelect
          value={location}
          onChange={onLocationChange}
          options={locationOptions}
          placeholder="Location"
        />

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 transition-colors"
          >
            <IconX />
            Clear
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-xs text-zinc-500">
        <span className="font-semibold text-zinc-700">{totalCount}</span>{" "}
        {totalCount === 1 ? "company" : "companies"} found
        {hasActiveFilters && " for current filters"}
      </p>
    </div>
  );
}
