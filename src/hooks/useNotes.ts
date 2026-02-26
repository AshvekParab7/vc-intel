"use client";

import { useState } from "react";
import { getItem, setItem } from "@/lib/localStorage";
import type { Note } from "@/lib/types";

// ─── Key ─────────────────────────────────────────────────────────────────────

function storageKey(companyId: string) {
  return `vc-intel:notes:${companyId}`;
}

// ─── Return type ─────────────────────────────────────────────────────────────

export interface UseNotesReturn {
  notes: Note[];
  addNote: (content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useNotes(companyId: string): UseNotesReturn {
  const key = storageKey(companyId);

  const [notes, setNotes] = useState<Note[]>(
    () => getItem<Note[]>(key) ?? []
  );

  function persist(updated: Note[]) {
    setNotes(updated);
    setItem(key, updated);
  }

  function addNote(content: string) {
    const now = new Date().toISOString();
    const note: Note = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      companyId,
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    };
    persist([note, ...notes]);
  }

  function updateNote(id: string, content: string) {
    persist(
      notes.map((n) =>
        n.id === id
          ? { ...n, content: content.trim(), updatedAt: new Date().toISOString() }
          : n
      )
    );
  }

  function deleteNote(id: string) {
    persist(notes.filter((n) => n.id !== id));
  }

  return { notes, addNote, updateNote, deleteNote };
}
