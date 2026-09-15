"use client";

import { ReactNode } from "react";
import { TopBar } from "@/components/navigation/TopBar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Sidebar } from "@/components/navigation/Sidebar";

/**
 * Collector Layout
 * Shared layout for collector-specific pages
 * Includes top bar, sidebar (desktop), and bottom navigation (mobile)
 */

export default function CollectorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="md:flex">
        {/* Sidebar - Desktop only */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Bar */}
          <TopBar />

          {/* Page Content */}
          <main className="flex-1 pb-20 md:pb-6">
            {children}
          </main>
        </div>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <BottomNav />
    </div>
  );
}
