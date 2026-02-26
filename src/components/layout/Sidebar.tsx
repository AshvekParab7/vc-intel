"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconBuilding({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
  );
}

function IconList({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

function IconBookmark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

// ─── Nav Items ────────────────────────────────────────────────────────────────

const navItems = [
  { label: "Companies", href: "/companies", icon: IconBuilding },
  { label: "Lists", href: "/lists", icon: IconList },
  { label: "Saved Searches", href: "/saved", icon: IconBookmark },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-zinc-950 transition-transform duration-300 ease-in-out",
          "lg:relative lg:translate-x-0 lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-14 items-center justify-between px-5 border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            {/* Logo mark */}
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              VC Intel
            </span>
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 transition-colors lg:hidden"
          >
            <IconClose />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
          <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Workspace
          </p>

          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={[
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-blue-500/15 text-blue-400"
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200",
                ].join(" ")}
              >
                <Icon
                  className={isActive ? "text-blue-400" : "text-zinc-500"}
                />
                {label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-800/60 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-300">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-zinc-300">
                Analyst
              </span>
              <span className="text-[11px] text-zinc-600">Free plan</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
