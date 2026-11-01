"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { homePath } from "@/lib/api/auth";

export default function Home() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Wait for the stored session, then go to the user's home screen or onboarding
    if (!hasHydrated) return;
    router.replace(user ? homePath(user.role) : "/onboarding");
  }, [hasHydrated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
    </div>
  );
}
