"use client";

import { useNoteStore } from "@/lib/store";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Dynamic import to avoid SSR issues with editor
const Editor = dynamic(() => import("@/components/editor/Editor"), {
  ssr: false,
});

export default function EditorArea() {
  const { notes, activeNoteId, updateNote, addNote } = useNoteStore();

  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeNoteId),
    [notes, activeNoteId]
  );

  if (!activeNoteId || !activeNote) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-background text-muted-foreground">
        <p className="mb-4">ノートを選択するか、新規作成してください</p>
        <Button onClick={addNote} className="gap-2">
          <Plus className="h-4 w-4" />
          新規ノート
        </Button>
      </div>
    );
  }

  if (activeNote.isTrash) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-destructive/5 text-destructive">
        <p>このノートはゴミ箱にあります。</p>
        <p className="text-sm text-muted-foreground">
          編集するには復元してください。
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background overflow-hidden">
      {/* Editor - Keyed by ID to force remount on switch */}
      <div className="flex-1 overflow-auto p-6">
        <Editor
          key={activeNote.id}
          initialContent={activeNote.content}
          onChange={(json) => updateNote(activeNote.id, { content: json })}
        />
      </div>
    </div>
  );
}
