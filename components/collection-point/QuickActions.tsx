"use client";

import { ClipboardCheck, Users, BarChart3, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useRouter } from "next/navigation";

/**
 * Quick Actions Panel
 * Quick access to common actions
 */

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      icon: ClipboardCheck,
      label: "Verify Collections",
      description: "Review pending submissions",
      onClick: () => router.push("/verify"),
      color: "var(--primary)",
    },
    {
      icon: Users,
      label: "Manage Collectors",
      description: "View collector information",
      onClick: () => router.push("/collectors"),
      color: "var(--info)",
    },
    {
      icon: BarChart3,
      label: "View Reports",
      description: "Detailed analytics",
      onClick: () => router.push("/reports"),
      color: "var(--success)",
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Point configuration",
      onClick: () => router.push("/settings"),
      color: "var(--muted-foreground)",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className="flex items-start gap-3 p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--muted)]/30 transition-all text-left"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${action.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: action.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium mb-0.5">{action.label}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {action.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
