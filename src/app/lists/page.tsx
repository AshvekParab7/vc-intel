"use client";

import { useState } from "react";
import Link from "next/link";
import { useLists } from "@/hooks/useLists";
import { companies as ALL } from "@/lib/data/companies";
import EmptyState from "@/components/ui/EmptyState";
import type { CompanyList } from "@/lib/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getCompanyById(id: string) {
  return ALL.find((c) => c.id === id) ?? null;
}

// ─── Create list form ─────────────────────────────────────────────────────────

interface CreateListFormProps {
  onCreate: (name: string) => void;
  onCancel: () => void;
}

function CreateListForm({ onCreate, onCancel }: CreateListFormProps) {
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
      setName("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/40 px-4 py-3"
    >
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="List name…"
        maxLength={60}
        className="h-8 flex-1 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="h-8 rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:bg-zinc-200 disabled:text-zinc-500 disabled:opacity-70"
      >
        Create
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="h-8 rounded-md px-3 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
      >
        Cancel
      </button>
    </form>
  );
}

// ─── List card ────────────────────────────────────────────────────────────────

interface ListCardProps {
  list: CompanyList;
  onAddCompany: (listId: string, companyId: string) => void;
  onRemoveCompany: (listId: string, companyId: string) => void;
  onDelete: (listId: string) => void;
  onExport: (list: CompanyList) => void;
}

function ListCard({
  list,
  onAddCompany,
  onRemoveCompany,
  onDelete,
  onExport,
}: ListCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Companies not yet in this list
  const availableToAdd = ALL.filter((c) => !list.companyIds.includes(c.id));

  function handleAddSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    if (id) {
      onAddCompany(list.id, id);
      e.target.value = "";
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-zinc-900">{list.name}</h3>
          <p className="mt-0.5 text-xs text-zinc-400">
            {list.companyIds.length === 0
              ? "No companies yet"
              : `${list.companyIds.length} ${list.companyIds.length === 1 ? "company" : "companies"}`}
          </p>
        </div>

        {/* Delete */}
        {confirmDelete ? (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-zinc-500">Delete list?</span>
            <button
              onClick={() => onDelete(list.id)}
              className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="rounded px-2 py-1 text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Delete list"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        )}
      </div>

      {/* Company chips */}
      {list.companyIds.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {list.companyIds.map((id) => {
            const company = getCompanyById(id);
            if (!company) return null;
            return (
              <Link
                key={id}
                href={`/companies/${id}`}
                className="group flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 pl-2.5 pr-1.5 py-1 text-xs font-medium text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
              >
                {company.name}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveCompany(list.id, id);
                  }}
                  className="flex h-4 w-4 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 transition-colors"
                  title={`Remove ${company.name}`}
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-zinc-400 italic">
          Add companies below to build this list.
        </p>
      )}

      {/* Actions row */}
      <div className="flex items-center gap-2 border-t border-zinc-100 pt-3">
        {/* Add company select */}
        {availableToAdd.length > 0 ? (
          <select
            onChange={handleAddSelect}
            defaultValue=""
            className="h-8 flex-1 rounded-md border border-zinc-200 bg-white px-2 pr-7 text-xs text-zinc-500 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
            }}
          >
            <option value="" disabled>
              + Add company…
            </option>
            {availableToAdd.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.sector}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-xs text-zinc-400">All companies added</span>
        )}

        {/* Export */}
        <button
          onClick={() => onExport(list)}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
          title="Export as JSON"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export JSON
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ListsPage() {
  const { lists, createList, deleteList, addCompany, removeCompany } =
    useLists();
  const [showCreateForm, setShowCreateForm] = useState(false);

  function handleCreate(name: string) {
    createList(name);
    setShowCreateForm(false);
  }

  function handleExport(list: CompanyList) {
    const companies = list.companyIds
      .map(getCompanyById)
      .filter(Boolean);

    downloadJson(
      { id: list.id, name: list.name, createdAt: list.createdAt, companies },
      `${list.name.toLowerCase().replace(/\s+/g, "-")}.json`
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Lists
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Organise companies into curated lists.
          </p>
        </div>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New list
          </button>
        )}
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div className="mb-6">
          <CreateListForm
            onCreate={handleCreate}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Lists grid or empty state */}
      {lists.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {lists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onAddCompany={addCompany}
              onRemoveCompany={removeCompany}
              onDelete={deleteList}
              onExport={handleExport}
            />
          ))}
        </div>
      ) : (
        !showCreateForm && (
          <EmptyState
            title="No lists yet"
            description="Create a list to start organising companies for your pipeline."
            action={
              <button
                onClick={() => setShowCreateForm(true)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                Create your first list
              </button>
            }
          />
        )
      )}
    </div>
  );
}
