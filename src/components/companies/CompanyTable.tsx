"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { getSectorColor, getStageColor } from "@/lib/utils";
import type { Company, SortField } from "@/lib/types";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconSort({
  active,
  dir,
}: {
  active: boolean;
  dir: "asc" | "desc";
}) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? "text-indigo-500" : "text-zinc-300"}
    >
      {active && dir === "asc" ? (
        <path d="M12 19V5M5 12l7-7 7 7" />
      ) : active && dir === "desc" ? (
        <path d="M12 5v14M5 12l7 7 7-7" />
      ) : (
        <>
          <path d="M8 9l4-4 4 4" />
          <path d="M16 15l-4 4-4-4" />
        </>
      )}
    </svg>
  );
}

function IconArrow() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconExternal() {
  return (
    <svg
      width="11"
      height="11"
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
  );
}

// ─── Sortable column header ───────────────────────────────────────────────────

interface ThProps {
  label: string;
  field?: SortField;
  sortBy: SortField;
  sortDir: "asc" | "desc";
  onSort: (field: SortField) => void;
  className?: string;
}

function Th({ label, field, sortBy, sortDir, onSort, className = "" }: ThProps) {
  const isActive = field !== undefined && sortBy === field;

  if (!field) {
    return (
      <th
        scope="col"
        className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 ${className}`}
      >
        {label}
      </th>
    );
  }

  return (
    <th
      scope="col"
      className={`px-4 py-3 text-left ${className}`}
    >
      <button
        onClick={() => onSort(field)}
        className={[
          "flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide transition-colors",
          isActive ? "text-indigo-600" : "text-zinc-500 hover:text-zinc-700",
        ].join(" ")}
      >
        {label}
        <IconSort active={isActive} dir={sortDir} />
      </button>
    </th>
  );
}

// ─── Row skeleton ─────────────────────────────────────────────────────────────

export function CompanyRowSkeleton() {
  return (
    <tr className="border-b border-zinc-100">
      {[80, 60, 56, 56, 72].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div
            className="h-4 animate-pulse rounded bg-zinc-100"
            style={{ width: w }}
          />
        </td>
      ))}
      <td className="px-4 py-3.5">
        <div className="h-7 w-16 animate-pulse rounded-lg bg-zinc-100" />
      </td>
    </tr>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CompanyTableProps {
  companies: Company[];
  sortBy: SortField;
  sortDir: "asc" | "desc";
  onSort: (field: SortField) => void;
  loading?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CompanyTable({
  companies,
  sortBy,
  sortDir,
  onSort,
  loading = false,
}: CompanyTableProps) {
  const colProps = { sortBy, sortDir, onSort };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <Th label="Company" field="name" {...colProps} className="min-w-[180px]" />
              <Th label="Sector" field="sector" {...colProps} className="min-w-[120px]" />
              <Th label="Stage" field="stage" {...colProps} className="min-w-[110px]" />
              <Th label="Location" field="location" {...colProps} className="min-w-[110px]" />
              <Th label="Website" sortBy={sortBy} sortDir={sortDir} onSort={onSort} className="min-w-[120px]" />
              <Th label="" sortBy={sortBy} sortDir={sortDir} onSort={onSort} className="w-16" />
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200 bg-white">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <CompanyRowSkeleton key={i} />
                ))
              : companies.map((company) => (
                  <tr
                    key={company.id}
                    className="group transition-colors hover:bg-zinc-50"
                  >
                    {/* Company name */}
                    <td className="px-4 py-4">
                      <Link
                        href={`/companies/${company.id}`}
                        className="font-medium text-zinc-900 hover:text-blue-600 transition-colors text-sm"
                      >
                        {company.name}
                      </Link>
                      {company.description && (
                        <p className="mt-0.5 max-w-[220px] truncate text-[11px] text-zinc-500">
                          {company.description}
                        </p>
                      )}
                    </td>

                    {/* Sector */}
                    <td className="px-4 py-4">
                      <Badge
                        label={company.sector}
                        className={getSectorColor(company.sector)}
                      />
                    </td>

                    {/* Stage */}
                    <td className="px-4 py-4">
                      <Badge
                        label={company.stage}
                        className={getStageColor(company.stage)}
                      />
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4 text-sm text-zinc-500">
                      {company.location}
                    </td>

                    {/* Website */}
                    <td className="px-4 py-4">
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-blue-600 transition-colors"
                      >
                        {company.website.replace(/^https?:\/\//, "")}
                        <IconExternal />
                      </a>
                    </td>

                    {/* View profile */}
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/companies/${company.id}`}
                        className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 group-hover:border-zinc-300 shadow-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
