"use client";

import { TrendingUp, Package, Award, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

/**
 * Profile Stats
 * Display user statistics
 */

interface ProfileStatsProps {
  stats: {
    totalCollections: number;
    totalEarnings: number;
    totalWeight: number;
    rank?: string;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    {
      icon: Package,
      label: "Collections",
      value: stats.totalCollections.toString(),
      color: "text-[var(--primary)]",
      bg: "bg-[var(--primary)]/10",
    },
    {
      icon: DollarSign,
      label: "Total Earnings",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      color: "text-[var(--success)]",
      bg: "bg-[var(--success)]/10",
    },
    {
      icon: TrendingUp,
      label: "Total Weight",
      value: `${stats.totalWeight.toFixed(1)} kg`,
      color: "text-[var(--info)]",
      bg: "bg-[var(--info)]/10",
    },
    ...(stats.rank
      ? [
          {
            icon: Award,
            label: "Rank",
            value: stats.rank,
            color: "text-[var(--warning)]",
            bg: "bg-[var(--warning)]/10",
          },
        ]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <p className="text-2xl font-bold mb-1">{item.value}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{item.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
