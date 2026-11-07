"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, LogOut, Phone, RefreshCw } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import {
  getMyProfile,
  updateMyProfile,
  type ProfileChanges,
} from "@/lib/api/profile";
import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
  const userId = useAuthStore((state) => state.user?.id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const profile = useQuery({
    queryKey: ["profile", userId],
    queryFn: async ({ signal }) => {
      const current = await getMyProfile(signal);
      if (current.id !== userId)
        throw new Error("The profile does not match this session");
      return current;
    },
    enabled: Boolean(userId),
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  async function save(changes: ProfileChanges) {
    const current = profile.data;
    if (!current) throw new Error("Profile is unavailable");
    const saved = await updateMyProfile(changes);
    if (
      saved.id !== current.id ||
      useAuthStore.getState().user?.id !== current.id
    ) {
      throw new Error("The session changed while saving");
    }
    const updated = { ...current, ...saved };
    queryClient.setQueryData(["profile", userId], updated);
    useAuthStore.getState().updateUser({
      name: `${saved.firstName} ${saved.lastName}`.trim(),
      email: saved.email ?? undefined,
      phone: saved.phoneNumber,
    });
    return updated;
  }

  const joined = profile.data ? new Date(profile.data.createdAt) : null;
  const joinedLabel =
    joined && !Number.isNaN(joined.getTime())
      ? joined.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Unavailable";

  return (
    <Container>
      <div className="space-y-6 py-6">
        <PageHeader title="Profile" description="Your account, your details." />
        {profile.isPending ? (
          <div role="status" aria-label="Loading profile" className="space-y-5">
            <span className="sr-only">Loading your account details.</span>
            <Skeleton className="h-44 rounded-2xl" />
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <Skeleton className="h-96 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
        ) : profile.data ? (
          <>
            <ProfileHeader profile={profile.data} />
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <ProfileForm
                key={profile.data.id}
                profile={profile.data}
                onSave={save}
              />
              <aside className="min-w-0 space-y-5">
                <section
                  aria-labelledby="profile-account-title"
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7"
                >
                  <h2 id="profile-account-title" className="font-semibold">
                    Account details
                  </h2>
                  <div className="mt-5 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--primary)]">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Sign-in phone number
                      </p>
                      <p className="mt-1 text-sm font-medium [overflow-wrap:anywhere]">
                        {profile.data.phoneNumber}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
                        This number identifies your account and cannot be
                        changed here.
                      </p>
                    </div>
                  </div>
                  <dl className="mt-5 space-y-4 border-t border-[var(--border)] pt-5 text-sm">
                    <div className="flex flex-wrap justify-between gap-2">
                      <dt className="text-[var(--muted-foreground)]">
                        Member since
                      </dt>
                      <dd>{joinedLabel}</dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-2">
                      <dt className="text-[var(--muted-foreground)]">
                        Country
                      </dt>
                      <dd className="min-w-0 [overflow-wrap:anywhere]">
                        {profile.data.country || "Not provided"}
                      </dd>
                    </div>
                  </dl>
                </section>
                <section
                  aria-labelledby="profile-wallet-title"
                  className="rounded-2xl border border-[var(--border)] bg-[var(--accent)]/50 p-5 sm:p-7"
                >
                  <h2 id="profile-wallet-title" className="font-semibold">
                    Your collection rewards
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    See your WASTE balance and the payments from your completed
                    collections.
                  </p>
                  <Link
                    href="/wallet"
                    className="mt-4 inline-flex items-center gap-2 rounded text-sm font-medium text-[var(--primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                  >
                    Open wallet
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </section>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    useAuthStore.getState().logout();
                    router.replace("/login");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                  Sign out
                </Button>
              </aside>
            </div>
          </>
        ) : (
          <div
            role="alert"
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8"
          >
            <h2 className="font-semibold">Your profile could not be loaded</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Check your connection and try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-5"
              onClick={() => {
                void profile.refetch();
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
