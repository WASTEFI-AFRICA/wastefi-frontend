import { Check, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { userRoles, userStatuses, type AdminUser } from "@/lib/api/admin-users";

interface Props {
  users: AdminUser[];
  pendingId: string | null;
  confirmedIds: string[];
  unconfirmedId: string | null;
  disabled: boolean;
  onActivate: (user: AdminUser) => void;
}

export function AccountList({
  users,
  pendingId,
  confirmedIds,
  unconfirmedId,
  disabled,
  onActivate,
}: Props) {
  return (
    <ul aria-label="User accounts" className="divide-y divide-[var(--border)]">
      {users.map((user) => {
        const status = confirmedIds.includes(user.id) ? "ACTIVE" : user.status;
        const name =
          `${user.firstName} ${user.lastName}`.trim() || user.phoneNumber;
        return (
          <li
            key={user.id}
            className="grid min-w-0 gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-center"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--primary)]"
              >
                <UserRound className="h-5 w-5" />
              </span>
              <div className="min-w-0 text-sm [overflow-wrap:anywhere]">
                <h3 className="font-semibold">{name}</h3>
                <p className="mt-1 text-[var(--muted-foreground)]">
                  {user.phoneNumber}
                </p>
                {user.email ? (
                  <p className="mt-1 text-[var(--muted-foreground)]">
                    {user.email}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="space-y-1 text-sm [overflow-wrap:anywhere]">
              <p>{userRoles[user.role]}</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Joined{" "}
                <time dateTime={user.createdAt}>
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(user.createdAt))}
                </time>
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                {[user.city, user.country].filter(Boolean).join(", ") ||
                  "Location not provided"}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status === "ACTIVE" ? "bg-[var(--accent)] text-[var(--primary-dark)]" : status === "PENDING" ? "bg-amber-100 text-amber-950" : "bg-[var(--muted)] text-[var(--muted-foreground)]"}`}
              >
                {status === "ACTIVE" ? (
                  <Check className="h-3 w-3" aria-hidden="true" />
                ) : null}
                {userStatuses[status]}
              </span>
              {status === "PENDING" ? (
                <Button
                  size="sm"
                  aria-label={`Activate ${name}`}
                  disabled={disabled || unconfirmedId === user.id}
                  onClick={() => onActivate(user)}
                >
                  {pendingId === user.id
                    ? "Activating…"
                    : unconfirmedId === user.id
                      ? "Refresh to check"
                      : "Activate account"}
                </Button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
