"use client";

import { Lock, Award, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui";
import type { Achievement } from "@/types/achievements";

/**
 * Achievement Card
 * Display individual achievement with progress
 */

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: () => void;
}

export function AchievementCard({ achievement, onClick }: AchievementCardProps) {
  const isUnlocked = !!achievement.unlockedAt;
  const progress = achievement.progress || 0;
  const progressPercent = Math.min((progress / achievement.requirement.target) * 100, 100);

  const tierColors = {
    bronze: "from-[#CD7F32] to-[#8B5A2B]",
    silver: "from-[#C0C0C0] to-[#808080]",
    gold: "from-[#FFD700] to-[#FFA500]",
    platinum: "from-[#E5E4E2] to-[#B4B4B4]",
  };

  const tierBadgeColors = {
    bronze: "bg-[#CD7F32]/10 text-[#CD7F32]",
    silver: "bg-[#C0C0C0]/10 text-[#808080]",
    gold: "bg-[#FFD700]/10 text-[#FFA500]",
    platinum: "bg-[#E5E4E2]/10 text-[#B4B4B4]",
  };

  return (
    <Card
      className={`${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      } ${!isUnlocked ? "opacity-60" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${
              isUnlocked ? tierColors[achievement.tier] : "from-[var(--muted)] to-[var(--muted)]"
            }`}
          >
            {isUnlocked ? (
              <span className="text-3xl">{achievement.icon}</span>
            ) : (
              <Lock className="w-8 h-8 text-white" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{achievement.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                  {achievement.description}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`capitalize ${tierBadgeColors[achievement.tier]}`}
              >
                {achievement.tier}
              </Badge>
            </div>

            {/* Progress */}
            {!isUnlocked && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[var(--muted-foreground)]">Progress</span>
                  <span className="font-medium">
                    {progress}/{achievement.requirement.target}
                  </span>
                </div>
                <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Rewards */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-[var(--primary)]" />
                <span className="font-medium">{achievement.reward.points} pts</span>
              </div>
              {achievement.reward.bonus && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-[var(--success)]" />
                  <span className="font-medium text-[var(--success)]">
                    ${achievement.reward.bonus}
                  </span>
                </div>
              )}
              {isUnlocked && achievement.unlockedAt && (
                <Badge variant="success" size="sm">
                  Unlocked
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
