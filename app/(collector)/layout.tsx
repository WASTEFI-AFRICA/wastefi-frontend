import { ReactNode } from "react";

/**
 * Collector Layout
 * Shared layout for collector-specific pages
 * Will include navigation in Phase 2
 */

export default function CollectorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation will be added in Phase 2 */}
      <main className="pb-20">
        {children}
      </main>
      {/* Bottom navigation will be added in Phase 2 */}
    </div>
  );
}
