"use client";

import { Minus, Square, X, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

declare global {
  interface Window {
    electronAPI?: {
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
      isMaximized: () => Promise<boolean>;
    };
  }
}

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(!!window.electronAPI);

    const checkMaximized = async () => {
      if (window.electronAPI) {
        const maximized = await window.electronAPI.isMaximized();
        setIsMaximized(maximized);
      }
    };

    checkMaximized();

    // Check periodically for maximize state changes
    const interval = setInterval(checkMaximized, 500);
    return () => clearInterval(interval);
  }, []);

  if (!isElectron) return null;

  return (
    <div
      className="flex items-center justify-between h-8 bg-sidebar border-b select-none"
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      {/* App title - draggable area */}
      <div className="flex-1 px-4 text-sm font-medium text-muted-foreground">
        Lumina
      </div>

      {/* Window controls - not draggable */}
      <div
        className="flex items-center"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-10 rounded-none hover:bg-muted"
          onClick={() => window.electronAPI?.minimizeWindow()}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-10 rounded-none hover:bg-muted"
          onClick={async () => {
            window.electronAPI?.maximizeWindow();
            // Immediately update state after action
            setTimeout(async () => {
              if (window.electronAPI) {
                const maximized = await window.electronAPI.isMaximized();
                setIsMaximized(maximized);
              }
            }, 100);
          }}
        >
          {isMaximized ? (
            <Square className="h-3.5 w-3.5" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-10 rounded-none hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => window.electronAPI?.closeWindow()}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
