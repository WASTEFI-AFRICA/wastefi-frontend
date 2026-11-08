"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { AccountList } from "@/components/admin/AccountList";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { APIError } from "@/lib/api/client";
import {
  activateUser,
  getAdminUsers,
  userRoles,
  userStatuses,
  type AdminUser,
  type UserFilters,
} from "@/lib/api/admin-users";
import { useAuthStore } from "@/store/authStore";

export default function UsersPage() {
  const userId = useAuthStore((state) => state.user?.id);
  const [filters, setFilters] = useState<UserFilters>({
    status: "PENDING",
    role: "",
    page: 1,
  });
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmedIds, setConfirmedIds] = useState<string[]>([]);
  const [unconfirmedId, setUnconfirmedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(
    null,
  );
  const busy = useRef(false);
  const users = useQuery({
    queryKey: ["admin-users", userId, filters],
    queryFn: ({ signal }) => getAdminUsers(filters, signal),
    enabled: Boolean(userId),
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const pagination = users.data?.pagination;
  const page = pagination?.page ?? filters.page;
  const disabled = pendingId !== null || users.isFetching;
  const sameAccount = () => useAuthStore.getState().user?.id === userId;

  function changeFilters(next: UserFilters) {
    setConfirmedIds([]);
    setFilters(next);
  }

  async function refreshUsers() {
    const result = await users.refetch();
    if (!result.isError && sameAccount()) {
      setConfirmedIds([]);
      setUnconfirmedId(null);
    }
  }

  async function activate(user: AdminUser) {
    if (
      busy.current ||
      disabled ||
      unconfirmedId ||
      user.status !== "PENDING" ||
      !sameAccount()
    )
      return;
    busy.current = true;
    setPendingId(user.id);
    setNotice(null);
    try {
      await activateUser(user.id);
      if (!sameAccount()) return;
      setConfirmedIds((ids) => [...ids, user.id]);
      const name =
        `${user.firstName} ${user.lastName}`.trim() || user.phoneNumber;
      setNotice({ text: `Account activated for ${name}.`, error: false });
      await refreshUsers();
    } catch (error) {
      if (!sameAccount()) return;
      const forbidden = error instanceof APIError && error.status === 403;
      if (!forbidden) setUnconfirmedId(user.id);
      setNotice({
        text: forbidden
          ? "You do not have permission to activate accounts."
          : "Activation could not be confirmed. Refresh users to check the account before trying again.",
        error: true,
      });
    } finally {
      busy.current = false;
      if (sameAccount()) setPendingId(null);
    }
  }

  return (
    <Container>
      <div className="space-y-6 py-6 sm:py-8">
        <PageHeader
          title="Users"
          description="Review accounts and help new users get started."
          actions={
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => void refreshUsers()}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${users.isFetching ? "animate-spin motion-reduce:animate-none" : ""}`}
                aria-hidden="true"
              />
              {users.isFetching ? "Refreshing…" : "Refresh users"}
            </Button>
          }
        />
        <section
          aria-labelledby="account-access-title"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] p-6 text-white sm:p-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border-[32px] border-white opacity-10"
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-white/80">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Account
                access
              </p>
              <h2
                id="account-access-title"
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                A clear start for every user.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                Activate pending accounts so users can sign in. Account
                activation keeps their existing role and identity verification
                status.
              </p>
            </div>
            <div
              className="min-w-0 shrink-0 sm:max-w-xs sm:text-right"
              aria-live="polite"
            >
              <p className="text-4xl font-semibold tracking-tight [overflow-wrap:anywhere]">
                {pagination
                  ? pagination.total.toLocaleString("en-US")
                  : users.isPending
                    ? "…"
                    : "Unavailable"}
              </p>
              <p className="mt-2 text-sm text-white/80">
                {users.isError && pagination
                  ? "Last loaded matching accounts"
                  : filters.status === "PENDING" && !filters.role
                    ? "Pending accounts"
                    : "Matching accounts"}
              </p>
            </div>
          </div>
        </section>

        {notice ? (
          <p
            role={notice.error ? "alert" : "status"}
            className={`rounded-xl border px-5 py-4 text-sm [overflow-wrap:anywhere] ${notice.error ? "border-amber-300 bg-amber-50 text-amber-950" : "border-[var(--border)] bg-[var(--accent)] text-[var(--primary-dark)]"}`}
          >
            {notice.text}
          </p>
        ) : null}

        <section
          aria-labelledby="accounts-title"
          className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"
        >
          <div className="space-y-5 border-b border-[var(--border)] px-5 py-5 sm:px-6">
            <div>
              <h2
                id="accounts-title"
                className="flex items-center gap-2 font-semibold"
              >
                <UsersRound
                  className="h-4 w-4 text-[var(--primary)]"
                  aria-hidden="true"
                />{" "}
                Account directory
              </h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Newest accounts first. Filter to find the users you need.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
              <div className="space-y-1.5 text-xs font-medium">
                <label htmlFor="account-status">Account status</label>
                <select
                  id="account-status"
                  value={filters.status}
                  disabled={pendingId !== null}
                  onChange={(event) =>
                    changeFilters({
                      ...filters,
                      status: event.target.value as UserFilters["status"],
                      page: 1,
                    })
                  }
                  className="block h-11 w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus-visible:outline-2 focus-visible:outline-[var(--primary)] disabled:opacity-50"
                >
                  <option value="">All statuses</option>
                  {Object.entries(userStatuses).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5 text-xs font-medium">
                <label htmlFor="account-role">Account role</label>
                <select
                  id="account-role"
                  value={filters.role}
                  disabled={pendingId !== null}
                  onChange={(event) =>
                    changeFilters({
                      ...filters,
                      role: event.target.value as UserFilters["role"],
                      page: 1,
                    })
                  }
                  className="block h-11 w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus-visible:outline-2 focus-visible:outline-[var(--primary)] disabled:opacity-50"
                >
                  <option value="">All roles</option>
                  {Object.entries(userRoles).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {users.isError ? (
            <div
              role="alert"
              className="m-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:mx-6"
            >
              {users.data
                ? "Could not refresh users. Showing the last loaded list. Refresh to check current account statuses."
                : users.error instanceof APIError && users.error.status === 403
                  ? "The user directory is not available for this account. Administrator access is required."
                  : "Users could not be loaded. Use Refresh users to try again."}
            </div>
          ) : null}
          <div aria-busy={users.isFetching}>
            {users.isPending ? (
              <div
                role="status"
                aria-label="Loading users"
                className="space-y-6 p-6"
              >
                {[0, 1, 2].map((key) => (
                  <Skeleton key={key} className="h-16 w-full" />
                ))}
              </div>
            ) : users.data?.data.length ? (
              <AccountList
                users={users.data.data}
                pendingId={pendingId}
                confirmedIds={confirmedIds}
                unconfirmedId={unconfirmedId}
                disabled={disabled || users.isError || unconfirmedId !== null}
                onActivate={(user) => void activate(user)}
              />
            ) : users.data ? (
              <div className="px-6 py-12 text-center">
                <UsersRound
                  className="mx-auto mb-3 h-7 w-7 text-[var(--muted-foreground)]"
                  aria-hidden="true"
                />
                <h3 className="font-semibold">
                  {filters.status === "PENDING" && !filters.role
                    ? "No accounts awaiting activation"
                    : "No users match these filters"}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  {filters.status === "PENDING" && !filters.role
                    ? "New pending accounts will appear here. Choose All statuses to browse other users."
                    : "Try another status or role, or refresh the directory."}
                </p>
              </div>
            ) : null}
          </div>
          {pagination ? (
            <nav
              aria-label="User directory pages"
              className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] px-5 py-4 text-xs text-[var(--muted-foreground)] sm:px-6"
            >
              <p>
                {pagination.total === 0
                  ? "0 accounts"
                  : `Page ${page.toLocaleString("en-US")} of ${pagination.totalPages.toLocaleString("en-US")} · ${pagination.total.toLocaleString("en-US")} matching accounts`}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Previous user page"
                  disabled={disabled || users.isError || page <= 1}
                  onClick={() => changeFilters({ ...filters, page: page - 1 })}
                >
                  <ArrowLeft
                    className="mr-1.5 h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Next user page"
                  disabled={
                    disabled || users.isError || page >= pagination.totalPages
                  }
                  onClick={() => changeFilters({ ...filters, page: page + 1 })}
                >
                  Next
                  <ArrowRight
                    className="ml-1.5 h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </nav>
          ) : null}
        </section>
      </div>
    </Container>
  );
}
