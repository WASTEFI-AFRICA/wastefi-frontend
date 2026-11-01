"use client";

import { ReactNode, useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { homePath } from "@/lib/api/auth";
import type { UserRole } from "@/types/api";

const noSubscription = () => () => {};

/**
 * False while React hydrates the server-rendered page, true afterwards. The server
 * never sees the stored session, so the first client render must match its HTML.
 */
function useIsHydratedClient(): boolean {
  return useSyncExternalStore(
    noSubscription,
    () => true,
    () => false
  );
}

/**
 * Shows its children only to a signed-in user with one of the allowed roles.
 * Anyone else is sent to sign in, and a signed-in user with another role is sent
 * to their own home screen.
 */
export function RequireAuth({ allow, children }: { allow: UserRole[]; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isClient = useIsHydratedClient();
  const storeReady = useAuthStore((state) => state.hasHydrated);
  const hasHydrated = isClient && storeReady;
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const allowed = isAuthenticated && user !== null && allow.includes(user.role);

  useEffect(() => {
    if (!hasHydrated || allowed) return;
    if (!isAuthenticated || !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else {
      router.replace(homePath(user.role));
    }
  }, [hasHydrated, allowed, isAuthenticated, user, pathname, router]);

  if (!hasHydrated || !allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]" />
      </div>
    );
  }

  return <>{children}</>;
}
