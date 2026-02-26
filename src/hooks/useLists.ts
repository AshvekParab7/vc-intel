"use client";

import { useState } from "react";
import { getItem, setItem } from "@/lib/localStorage";
import type { CompanyList } from "@/lib/types";

// ─── Storage key ──────────────────────────────────────────────────────────────

const KEY = "vc_lists";

// ─── Return type ─────────────────────────────────────────────────────────────

export interface UseListsReturn {
  lists: CompanyList[];
  createList: (name: string) => void;
  deleteList: (id: string) => void;
  addCompany: (listId: string, companyId: string) => void;
  removeCompany: (listId: string, companyId: string) => void;
  isInList: (listId: string, companyId: string) => boolean;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useLists(): UseListsReturn {
  const [lists, setLists] = useState<CompanyList[]>(
    () => getItem<CompanyList[]>(KEY) ?? []
  );

  function persist(updated: CompanyList[]) {
    setLists(updated);
    setItem(KEY, updated);
  }

  function createList(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newList: CompanyList = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: trimmed,
      companyIds: [],
      createdAt: new Date().toISOString(),
    };
    persist([...lists, newList]);
  }

  function deleteList(id: string) {
    persist(lists.filter((l) => l.id !== id));
  }

  function addCompany(listId: string, companyId: string) {
    persist(
      lists.map((l) =>
        l.id === listId && !l.companyIds.includes(companyId)
          ? { ...l, companyIds: [...l.companyIds, companyId] }
          : l
      )
    );
  }

  function removeCompany(listId: string, companyId: string) {
    persist(
      lists.map((l) =>
        l.id === listId
          ? { ...l, companyIds: l.companyIds.filter((id) => id !== companyId) }
          : l
      )
    );
  }

  function isInList(listId: string, companyId: string): boolean {
    return (
      lists.find((l) => l.id === listId)?.companyIds.includes(companyId) ??
      false
    );
  }

  return { lists, createList, deleteList, addCompany, removeCompany, isInList };
}
