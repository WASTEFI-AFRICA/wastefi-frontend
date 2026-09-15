"use client";

import { Menu, Bell, Recycle } from "lucide-react";
import { Button } from "@/components/ui";
import { useUIStore } from "@/store/uiStore";
import { SyncStatusBadge } from "@/components/offline/OfflineIndicator";
import { useStorageStats } from "@/lib/hooks/useOfflineStorage";

/**
 * Top Bar
 * Header with logo, notifications, and menu toggle
 */

interface TopBarProps {
  title?: string;
  showMenu?: boolean;
}

export function TopBar({ title, showMenu = true }: TopBarProps) {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const { stats } = useStorageStats();

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

        {/* Right: Sync Status + Notifications */}
        <div className="flex items-center gap-2">
          <SyncStatusBadge 
            pendingCount={stats.pendingSubmissions + stats.syncQueueSize}
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {/* Notification badge - will be dynamic later */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--error)] rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  );
}
