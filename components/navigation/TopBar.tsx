"use client";

import { Menu, Recycle } from "lucide-react";
import { Button } from "@/components/ui";
import { useUIStore } from "@/store/uiStore";

/**
 * Top Bar
 * Header with logo and menu toggle
 */

interface TopBarProps {
  title?: string;
  showMenu?: boolean;
}

export function TopBar({ title, showMenu = true }: TopBarProps) {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="sticky top-0 z-40 bg-[var(--card)] border-b border-[var(--border)]">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left: Menu + Logo/Title */}
        <div className="flex items-center gap-3">
          {showMenu && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <Recycle className="w-6 h-6 text-[var(--primary)]" />
            <span className="font-semibold text-lg">
              {title || "WasteFi"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
