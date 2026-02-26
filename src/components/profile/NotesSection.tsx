"use client";

import { useState, useRef } from "react";
import { useNotes } from "@/hooks/useNotes";
import type { Note } from "@/lib/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 86400 * 7) return `${Math.floor(secs / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ─── Single note row ──────────────────────────────────────────────────────────

function NoteRow({
  note,
  onUpdate,
  onDelete,
}: {
  note: Note;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function startEdit() {
    setDraft(note.content);
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  function save() {
    if (draft.trim() && draft.trim() !== note.content) {
      onUpdate(note.id, draft);
    } else {
      setDraft(note.content);
    }
    setEditing(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
    if (e.key === "Escape") {
      setDraft(note.content);
      setEditing(false);
    }
  }

  return (
    <div className="group rounded-lg border border-zinc-100 bg-zinc-50/60 px-4 py-3 transition-colors hover:border-zinc-200">
      {editing ? (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            rows={3}
            className="w-full resize-none rounded-md border border-indigo-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={save}
              disabled={!draft.trim()}
              className="rounded-md bg-indigo-500 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-600 disabled:opacity-40 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => { setDraft(note.content); setEditing(false); }}
              className="rounded-md px-3 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <span className="ml-1 text-[10px] text-zinc-400">⌘↵ to save · Esc to cancel</span>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <p className="flex-1 text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
            {note.content}
          </p>
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={startEdit}
              className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 transition-colors"
              title="Edit note"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Delete note"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <p className="mt-1.5 text-[10px] text-zinc-400">
        {note.updatedAt !== note.createdAt
          ? `Edited ${timeAgo(note.updatedAt)}`
          : timeAgo(note.createdAt)}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NotesSection({ companyId }: { companyId: string }) {
  const { notes, addNote, updateNote, deleteNote } = useNotes(companyId);
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);

  function handleSubmit() {
    if (!draft.trim()) return;
    addNote(draft);
    setDraft("");
    setFocused(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
    if (e.key === "Escape") {
      setDraft("");
      setFocused(false);
    }
  }

  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Notes{notes.length > 0 && <span className="ml-2 text-zinc-500">{notes.length}</span>}
      </h2>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-4">
        {/* Composer */}
        <div className={`rounded-lg border transition-all ${focused ? "border-blue-300 ring-2 ring-blue-100" : "border-zinc-200"}`}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => { if (!draft.trim()) setFocused(false); }}
            onKeyDown={handleKey}
            placeholder="Add a note about this company…"
            rows={focused || draft ? 3 : 1}
            className="w-full resize-none rounded-t-lg bg-transparent px-3 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none"
          />
          {(focused || draft) && (
            <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-2">
              <span className="text-[10px] text-zinc-400">⌘↵ to save · Esc to cancel</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setDraft(""); setFocused(false); }}
                  className="rounded px-2.5 py-1 text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!draft.trim()}
                  className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
                >
                  Save note
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notes list */}
        {notes.length > 0 ? (
          <div className="space-y-2">
            {notes.map((note) => (
              <NoteRow
                key={note.id}
                note={note}
                onUpdate={updateNote}
                onDelete={deleteNote}
              />
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-xs text-zinc-400">
            No notes yet. Add one above.
          </p>
        )}
      </div>
    </section>
  );
}
