"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SampleDataNotice } from "@/components/layout/SampleDataNotice";
import { RequireAuth } from "@/components/auth/RequireAuth";

// Screens in this group that read real data from the API. The rest still show
// sample figures and keep the notice until they are moved over.
const LIVE_SCREENS = ["/dashboard", "/collections"];

/**
 * Collector Layout
 * Shared layout for collector-specific pages
 * Includes top bar, sidebar (desktop), and bottom navigation (mobile)
 */

export default function CollectorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <RequireAuth allow={["collector"]}>
      <div className="min-h-screen bg-[var(--background)]">
        <div className="md:flex">
          {/* Sidebar - Desktop only */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Top Bar */}
            <TopBar />
            {!LIVE_SCREENS.includes(pathname) && <SampleDataNotice />}

            {/* Page Content */}
            <main className="flex-1 pb-20 md:pb-6">{children}</main>
          </div>
        </div>

        {/* Bottom Navigation - Mobile only */}
        <BottomNav />
      </div>
    </RequireAuth>
  );
}
