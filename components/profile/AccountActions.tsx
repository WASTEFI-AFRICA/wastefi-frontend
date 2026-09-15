"use client";

import { Settings, LogOut, Shield, Bell, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { useRouter } from "next/navigation";

/**
 * Account Actions
 * Quick actions for account management
 */

interface AccountActionsProps {
  onLogout?: () => void;
}

export function AccountActions({ onLogout }: AccountActionsProps) {
  const router = useRouter();

  const actions = [
    {
      icon: Settings,
      label: "Settings",
      description: "Manage preferences",
      onClick: () => router.push("/settings"),
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Configure alerts",
      onClick: () => router.push("/settings?tab=notifications"),
    },
    {
      icon: Globe,
      label: "Language",
      description: "Change language",
      onClick: () => router.push("/settings?tab=language"),
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      description: "Manage your data",
      onClick: () => router.push("/settings?tab=privacy"),
    },
    {
      icon: LogOut,
      label: "Log Out",
      description: "Sign out of your account",
      onClick: onLogout,
      danger: true,
    },
  ];

  return (
    <Card>
      <CardContent className="p-0">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`w-full flex items-center gap-4 p-4 hover:bg-[var(--muted)] transition-colors ${
                index !== actions.length - 1 ? "border-b border-[var(--border)]" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  action.danger
                    ? "bg-[var(--error)]/10"
                    : "bg-[var(--muted)]"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    action.danger ? "text-[var(--error)]" : "text-[var(--foreground)]"
                  }`}
                />
              </div>
              <div className="flex-1 text-left">
                <p
                  className={`font-medium ${
                    action.danger ? "text-[var(--error)]" : ""
                  }`}
                >
                  {action.label}
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
