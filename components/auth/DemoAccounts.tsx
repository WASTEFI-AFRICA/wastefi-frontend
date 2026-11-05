"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * Demo accounts for people evaluating WasteFi. Shown on the sign-in page when the
 * deployment sets NEXT_PUBLIC_DEMO_PASSWORD, the password the API seeds the demo
 * accounts with (DEMO_ACCOUNT_PASSWORD on the backend). It is public on purpose:
 * these accounts only exist on the testnet demo.
 */

export const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

const ACCOUNTS = [
  {
    phone: "+254700000102",
    role: "Collection point",
    does: "approve collections and watch them get paid on Stellar",
  },
  {
    phone: "+254700000101",
    role: "Collector",
    does: "see WASTE earned and the Stellar proof for each collection",
  },
];

export function DemoAccounts({
  onUse,
  busy = false,
}: {
  /** Sign in with these credentials. */
  onUse: (phone: string, password: string) => void;
  /** True while a sign-in is in progress; the buttons are disabled. */
  busy?: boolean;
}) {
  if (!DEMO_PASSWORD) return null;
  const password = DEMO_PASSWORD;

  return (
    <section
      aria-label="Try the demo"
      className="rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-4 space-y-3"
    >
      <p className="flex items-center gap-2 font-semibold">
        <Sparkles className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
        Try the demo
      </p>
      <ul className="space-y-2">
        {ACCOUNTS.map((account) => (
          <li key={account.phone} className="flex items-start justify-between gap-3 text-sm">
            <span>
              <span className="font-medium">{account.role}</span>{" "}
              <span className="font-mono">{account.phone}</span>
              <span className="block text-[var(--muted-foreground)]">{account.does}</span>
            </span>
            <button
              type="button"
              onClick={() => onUse(account.phone, password)}
              disabled={busy}
              className="flex-shrink-0 rounded-md bg-[var(--primary)] px-3 py-1.5 font-medium text-white hover:bg-[var(--primary)]/90 disabled:opacity-60"
              aria-label={`Sign in as the ${account.role.toLowerCase()} demo account`}
            >
              Sign in
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-[var(--muted-foreground)]">
        Password: <span className="font-mono">{password}</span>. Or{" "}
        <Link href="/register" className="underline underline-offset-4">
          create your own collector account
        </Link>{" "}
        and submit a collection. Stellar testnet only.
      </p>
    </section>
  );
}
