"use client";

import { Package, Scale, DollarSign, Flame, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import type { UserStats } from "@/types/achievements";

/**
 * Stats Overview
 * Display user gamification statistics
 */

interface StatsOverviewProps {
  stats: UserStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statItems = [
    {
      icon: Package,
      label: "Collections",
      value: stats.totalCollections.toString(),
      color: "text-[var(--primary)]",
      bg: "bg-[var(--primary)]/10",
    },
    {
      icon: Scale,
      label: "Total Weight",
      value: `${stats.totalWeight.toFixed(1)} kg`,
      color: "text-[var(--info)]",
      bg: "bg-[var(--info)]/10",
    },
    {
      icon: DollarSign,
      label: "Earnings",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      color: "text-[var(--success)]",
      bg: "bg-[var(--success)]/10",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${stats.currentStreak} days`,
      color: "text-[var(--warning)]",
      bg: "bg-[var(--warning)]/10",
    },
    {
      icon: Award,
      label: "Achievements",
      value: stats.achievementsUnlocked.toString(),
      color: "text-[var(--primary)]",
      bg: "bg-[var(--primary)]/10",
    },
    {
      icon: Users,
      label: "Global Rank",
      value: `#${stats.rank}`,
      color: "text-[#FFD700]",
      bg: "bg-[#FFD700]/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <p className="font-bold text-lg mb-0.5">{item.value}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{item.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
