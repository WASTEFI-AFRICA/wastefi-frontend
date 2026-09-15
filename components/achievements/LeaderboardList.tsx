"use client";

import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { LeaderboardEntry } from "@/types/achievements";

/**
 * Leaderboard List
 * Display user rankings
 */

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  title?: string;
}

export function LeaderboardList({ entries, title = "Leaderboard" }: LeaderboardListProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-[#FFD700]" />;
      case 2:
        return <Medal className="w-6 h-6 text-[#C0C0C0]" />;
      case 3:
        return <Medal className="w-6 h-6 text-[#CD7F32]" />;
      default:
        return <span className="text-sm font-bold text-[var(--muted-foreground)]">#{rank}</span>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {entries.map((entry, index) => (
          <div
            key={entry.userId}
            className={`flex items-center gap-4 p-4 ${
              index !== entries.length - 1 ? "border-b border-[var(--border)]" : ""
            } ${entry.isCurrentUser ? "bg-[var(--primary)]/5" : ""}`}
          >
            {/* Rank */}
            <div className="w-10 flex items-center justify-center">
              {getRankIcon(entry.rank)}
            </div>

            {/* Avatar */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                entry.isCurrentUser
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted)] text-[var(--foreground)]"
              }`}
            >
              {entry.avatar ? (
                <img
                  src={entry.avatar}
                  alt={entry.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(entry.name)
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">
                {entry.name}
                {entry.isCurrentUser && (
                  <span className="text-xs text-[var(--primary)] ml-2">(You)</span>
                )}
              </p>
              <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)] mt-0.5">
                <span>{entry.stats.totalCollections} collections</span>
                <span>•</span>
                <span>{entry.stats.totalWeight.toFixed(1)} kg</span>
                <span>•</span>
                <span>{entry.stats.achievementCount} badges</span>
              </div>
            </div>

            {/* Earnings */}
            <div className="text-right">
              <p className="font-bold text-[var(--success)]">
                ${entry.stats.totalEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">earned</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
