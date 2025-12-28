"use client";

import { useDebouncedCallback } from "use-debounce";
import { useMemo } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
// Note: recent blocknote uses  @blocknote/shadcn or similar, but let's check installed packages.
// I installed @blocknote/core @blocknote/react @blocknote/mantine.
// So imports should be fine.

interface EditorProps {
  initialContent?: string; // serialized blocks
  onChange: (json: string) => void;
  editable?: boolean;
}

export default function Editor({
  initialContent,
  onChange,
  editable = true,
}: EditorProps) {
  // Parse initial content safely
  const parsedContent = useMemo(() => {
    if (!initialContent || initialContent === "[]" || initialContent === "") {
      return undefined;
    }
    try {
      return JSON.parse(initialContent);
    } catch (e) {
      console.error("Failed to parse note content", e);
      return undefined;
    }
  }, [initialContent]);

  const editor = useCreateBlockNote({
    initialContent: parsedContent,
    placeholders: {
      default: "",
      heading: "",
      bulletListItem: "",
      numberedListItem: "",
      checkListItem: "",
    },
  });

  const debouncedOnChange = useDebouncedCallback((json: string) => {
    onChange(json);
  }, 1000);

  return (
    <div
      className="min-h-full w-full cursor-text"
      onClick={() => {
        if (editor) {
          editor.focus();
        }
      }}
    >
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme="light" // or systematic
        onChange={() => {
          // Serialize and pass back
          debouncedOnChange(JSON.stringify(editor.document));
        }}
        className="h-full"
      />
    </div>
  );
}
