"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLists } from "@/hooks/useLists";

// ─── Props ────────────────────────────────────────────────────────────────────

interface SaveToListButtonProps {
  companyId: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SaveToListButton({ companyId }: SaveToListButtonProps) {
  const { lists, addCompany, removeCompany, isInList } = useLists();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Count how many lists contain this company
  const savedCount = lists.filter((l) => l.companyIds.includes(companyId)).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={savedCount > 0 ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={savedCount > 0 ? "text-blue-500" : "text-zinc-500"}
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        {savedCount > 0 ? `Saved (${savedCount})` : "Save to list"}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1.5 w-60 rounded-xl border border-zinc-200 bg-white shadow-lg">
          {lists.length === 0 ? (
            <div className="px-4 py-4 text-center">
              <p className="text-sm font-medium text-zinc-700">No lists yet</p>
              <p className="mt-0.5 text-xs text-zinc-400">
                Create a list first to save companies.
              </p>
              <Link
                href="/lists"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
              >
                Go to Lists →
              </Link>
            </div>
          ) : (
            <>
              <div className="px-3 py-2.5 border-b border-zinc-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Save to list
                </p>
              </div>
              <ul className="max-h-52 overflow-y-auto py-1">
                {lists.map((list) => {
                  const saved = isInList(list.id, companyId);
                  return (
                    <li key={list.id}>
                      <button
                        onClick={() => {
                          saved
                            ? removeCompany(list.id, companyId)
                            : addCompany(list.id, companyId);
                        }}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm hover:bg-zinc-50 transition-colors"
                      >
                        {/* Checkbox */}
                        <span
                          className={[
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                            saved
                              ? "border-blue-500 bg-blue-500"
                              : "border-zinc-300 bg-white",
                          ].join(" ")}
                        >
                          {saved && (
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span className="flex-1 text-left text-zinc-700">
                          {list.name}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {list.companyIds.length}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-zinc-100 px-3 py-2">
                <Link
                  href="/lists"
                  onClick={() => setOpen(false)}
                  className="text-xs text-zinc-400 hover:text-blue-600 transition-colors"
                >
                  Manage lists →
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
