"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconMenu({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TopbarProps {
  onMenuClick: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/companies?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  }

  return (
    <header className="flex h-14 min-w-0 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 lg:px-6">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors lg:hidden"
        aria-label="Open navigation"
      >
        <IconMenu />
      </button>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-1 max-w-xl">
        <div className="relative w-full">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search companies, sectors, locations…"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-4 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </form>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        {/* Keyboard hint — desktop */}
        <span className="hidden items-center gap-1 lg:flex">
          <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
            ⌘K
          </kbd>
        </span>

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-zinc-200 hidden lg:block" />

        {/* Dot badge */}
        <div className="relative">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-zinc-600"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
        </div>

        {/* Avatar */}
        <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
          A
        </div>
      </div>
    </header>
  );
}
