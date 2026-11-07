import { UserRound } from "lucide-react";
import type { CollectorProfile } from "@/lib/api/profile";

const roles = {
  COLLECTOR: "Collector",
  COLLECTION_POINT: "Collection point",
  VERIFIER: "Verifier",
  ADMIN: "Admin",
};

export function ProfileHeader({ profile }: { profile: CollectorProfile }) {
  const initials =
    `${profile.firstName.trim()[0] ?? ""}${profile.lastName.trim()[0] ?? ""}`.toUpperCase();
  const name = `${profile.firstName} ${profile.lastName}`.trim();
  const status = profile.status[0] + profile.status.slice(1).toLowerCase();

  return (
    <section
      aria-labelledby="profile-name"
      className="relative min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] p-6 text-white sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border-[32px] border-white opacity-10"
      />
      <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div
          aria-hidden="true"
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-xl font-semibold text-[var(--primary-dark)]"
        >
          {initials || <UserRound className="h-7 w-7" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-white/80">
            {roles[profile.role]} account
          </p>
          <h2
            id="profile-name"
            className="text-2xl font-semibold tracking-tight [overflow-wrap:anywhere] sm:text-3xl"
          >
            {name}
          </h2>
          <p className="mt-2 text-sm text-white/85 [overflow-wrap:anywhere]">
            {profile.email || profile.phoneNumber}
          </p>
        </div>
        <span className="relative shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
          Account {status.toLowerCase()}
        </span>
      </div>
    </section>
  );
}
