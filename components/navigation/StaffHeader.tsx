"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Recycle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const NAVIGATION = {
  collection_point: [
    { href: "/verify", label: "Verify collections" },
    { href: "/cp-dashboard", label: "Dashboard" },
    { href: "/inventory", label: "Inventory" },
    { href: "/payments", label: "Payments" },
    { href: "/analytics", label: "Analytics" },
  ],
  admin: [
    { href: "/admin-dashboard", label: "Dashboard" },
    { href: "/users", label: "Users" },
    { href: "/fraud-detection", label: "Fraud detection" },
    { href: "/verify", label: "Verify collections" },
  ],
};

export function StaffHeader({ area }: { area: keyof typeof NAVIGATION }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const links = NAVIGATION[area];
  const areaName = area === "admin" ? "Administration" : "Collection point";

  const handleSignOut = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-3 py-3">
          <Link
            href={links[0].href}
            aria-label={`WasteFi ${areaName}`}
            className="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary)]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-sm">
              <Recycle className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <span className="block text-lg font-bold tracking-tight">
                WasteFi
              </span>
              <span className="hidden text-xs text-[var(--muted-foreground)] sm:block">
                {areaName}
              </span>
            </div>
          </Link>
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden="true"
                className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--accent)] text-sm font-semibold text-[var(--primary)] sm:flex"
              >
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
              <div className="min-w-0 text-right text-sm sm:text-left">
                <p className="truncate font-semibold" title={user?.name}>
                  {user?.name}
                </p>
                <p className="hidden text-xs text-[var(--muted-foreground)] sm:block">
                  {areaName}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="shrink-0 rounded-lg"
            >
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </div>
        <nav
          aria-label={areaName}
          className="flex gap-1 overflow-x-auto border-t border-[var(--border)] py-2"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]",
                pathname === link.href
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]",
              )}
            >
              {link.label}
            </Link>
          ))}
          {area === "collection_point" && user?.role === "admin" && (
            <Link
              href="/admin-dashboard"
              className="shrink-0 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--primary)] hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              Administration
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
