import { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";

/**
 * Auth Layout
 * Shared layout for authentication pages (login, register)
 */

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--muted)] p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo height={44} priority />
        </div>
        {children}
      </div>
    </div>
  );
}
