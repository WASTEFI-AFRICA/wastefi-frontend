"use client";

import { Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { Achievement } from "@/types/achievements";

/**
 * Milestone Progress
 * Display progress towards next achievement
 */

interface MilestoneProgressProps {
  achievement: Achievement;
  currentValue: number;
}

export function MilestoneProgress({ achievement, currentValue }: MilestoneProgressProps) {
  const progress = Math.min((currentValue / achievement.requirement.target) * 100, 100);
  const remaining = Math.max(achievement.requirement.target - currentValue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5" />
          Next Milestone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Achievement Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-2xl">
            {achievement.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{achievement.title}</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              {achievement.description}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[var(--muted-foreground)]">Progress</span>
            <span className="font-semibold">
              {currentValue}/{achievement.requirement.target} {achievement.requirement.type}
            </span>
          </div>
          <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] transition-all relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">
            {remaining > 0 ? (
              <>
                Just {remaining} more {achievement.requirement.type} to unlock!
              </>
            ) : (
              <>Achievement unlocked! 🎉</>
            )}
          </p>
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-4 p-3 rounded-lg bg-[var(--muted)]/30">
          <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
          <div className="flex-1">
            <p className="text-sm font-medium">Rewards</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              {achievement.reward.points} points
              {achievement.reward.bonus && ` + $${achievement.reward.bonus} bonus`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
