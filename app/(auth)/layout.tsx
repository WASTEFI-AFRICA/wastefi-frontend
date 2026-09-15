import { ReactNode } from "react";

/**
 * Auth Layout
 * Shared layout for authentication pages (login, register)
 */

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--muted)] p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
