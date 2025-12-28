"use client";

import { useNoteStore } from "@/lib/store";
import { Plus, Search, Trash2, FileText, Reply, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Helper to extract plain text from BlockNote JSON content
const extractPreviewText = (
  contentJson: string,
  maxLength: number = 40
): string => {
  if (!contentJson || contentJson === "" || contentJson === "[]") {
    return "（空白のノート）";
  }

  try {
    const blocks = JSON.parse(contentJson);
    if (!Array.isArray(blocks) || blocks.length === 0) {
      return "（空白のノート）";
    }

    // Extract text from all blocks
    let text = "";
    for (const block of blocks) {
      if (block.content) {
        if (Array.isArray(block.content)) {
          // Inline content array
          for (const item of block.content) {
            if (item.text) {
              text += item.text;
            }
          }
        } else if (typeof block.content === "string") {
          text += block.content;
        }
      }
      if (text.length >= maxLength) break;
    }

    text = text.trim();
    if (!text) return "（空白のノート）";

    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  } catch (e) {
    return "（空白のノート）";
  }
};

export default function Sidebar() {
  const {
    notes,
    activeNoteId,
    searchQuery,
    addNote,
    setActiveNoteId,
    setSearchQuery,
    deleteNote,
    restoreNote,
    permanentlyDeleteNote,
  } = useNoteStore();

  const [isTrashView, setIsTrashView] = useState(false);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const preview = extractPreviewText(note.content, 100);
        const matchesSearch =
          preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTrash = isTrashView ? note.isTrash : !note.isTrash;
        return matchesSearch && matchesTrash;
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [notes, searchQuery, isTrashView]);

  // Keyboard shortcut for New Note (Ctrl+N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        e.stopPropagation();
        if (isTrashView) setIsTrashView(false);
        addNote();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addNote, isTrashView]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-full w-full flex-col border-r bg-sidebar text-sidebar-foreground">
        {/* Header */}
        <div className="p-4">
          {/* Search with trash button */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ノートを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isTrashView ? "destructive" : "ghost"}
                  size="icon"
                  onClick={() => setIsTrashView(!isTrashView)}
                  className="h-9 w-9 shrink-0"
                >
                  {isTrashView ? (
                    <Reply className="h-4 w-4" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isTrashView ? "ノートに戻る" : "ゴミ箱"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Add Button (only in normal view) */}
          {!isTrashView && (
            <Button onClick={addNote} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              新規ノート
            </Button>
          )}
        </div>

        <Separator />

        {/* Note List */}
        <ScrollArea className="flex-1 px-2 py-2">
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <span className="text-sm">ノートがありません</span>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotes.map((note) => {
                const preview = extractPreviewText(note.content, 40);
                return (
                  <div
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={cn(
                      "group relative cursor-pointer rounded-lg p-0 transition-all",
                      activeNoteId === note.id
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <FileText
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          activeNoteId === note.id
                            ? "text-sidebar-primary"
                            : "text-muted-foreground"
                        )}
                      />
                      <div className="flex-1 overflow-hidden">
                        <p
                          className={cn(
                            "text-sm leading-relaxed",
                            activeNoteId === note.id
                              ? "text-sidebar-primary font-medium"
                              : "text-foreground"
                          )}
                        >
                          {preview}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
                      {isTrashView ? (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  restoreNote(note.id);
                                }}
                              >
                                <Reply className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>復元</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:bg-destructive/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  permanentlyDeleteNote(note.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>完全に削除</p>
                            </TooltipContent>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNote(note.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>削除</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
