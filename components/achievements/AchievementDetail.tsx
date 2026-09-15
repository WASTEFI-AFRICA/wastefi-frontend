"use client";

import { format } from "date-fns";
import { X, Award, DollarSign, Target, CheckCircle2, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import type { Achievement } from "@/types/achievements";

/**
 * Achievement Detail Modal
 * Detailed view of an achievement
 */

interface AchievementDetailProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementDetail({ achievement, onClose }: AchievementDetailProps) {
  const isUnlocked = !!achievement.unlockedAt;
  const progress = achievement.progress || 0;
  const progressPercent = Math.min((progress / achievement.requirement.target) * 100, 100);

  const tierColors = {
    bronze: "from-[#CD7F32] to-[#8B5A2B]",
    silver: "from-[#C0C0C0] to-[#808080]",
    gold: "from-[#FFD700] to-[#FFA500]",
    platinum: "from-[#E5E4E2] to-[#B4B4B4]",
  };

  const categoryLabels = {
    collections: "Collections",
    earnings: "Earnings",
    environmental: "Environmental Impact",
    social: "Social",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4">
      <Card className="w-full md:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl">
        <CardHeader className="border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <CardTitle>Achievement Details</CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div
              className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 bg-gradient-to-br ${
                isUnlocked ? tierColors[achievement.tier] : "from-[var(--muted)] to-[var(--muted)]"
              }`}
            >
              {isUnlocked ? (
                <span className="text-5xl">{achievement.icon}</span>
              ) : (
                <Lock className="w-12 h-12 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{achievement.title}</h2>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Badge variant="outline" className="capitalize">
                {achievement.tier}
              </Badge>
              <Badge variant="outline">{categoryLabels[achievement.category]}</Badge>
            </div>
            <p className="text-[var(--muted-foreground)]">{achievement.description}</p>
          </div>

          {/* Status */}
          {isUnlocked ? (
            <div className="p-4 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[var(--success)]" />
                <div>
                  <p className="font-semibold text-[var(--success)]">Achievement Unlocked!</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {achievement.unlockedAt && format(new Date(achievement.unlockedAt), "MMMM dd, yyyy • HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Progress</span>
                <span className="font-semibold">
                  {progress}/{achievement.requirement.target}
                </span>
              </div>
              <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                {achievement.requirement.target - progress} more {achievement.requirement.type} to unlock
              </p>
            </div>
          )}

          {/* Requirements */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Requirements
            </h3>
            <div className="p-3 rounded-lg bg-[var(--muted)]/30">
              <p className="text-sm capitalize">
                {achievement.requirement.type}: {achievement.requirement.target}
              </p>
            </div>
          </div>

          {/* Rewards */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Award className="w-5 h-5" />
              Rewards
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-xs text-[var(--muted-foreground)]">Points</span>
                </div>
                <p className="text-lg font-bold text-[var(--primary)]">
                  {achievement.reward.points}
                </p>
              </div>
              {achievement.reward.bonus && (
                <div className="p-3 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-[var(--success)]" />
                    <span className="text-xs text-[var(--muted-foreground)]">Bonus</span>
                  </div>
                  <p className="text-lg font-bold text-[var(--success)]">
                    ${achievement.reward.bonus}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action */}
          <Button variant="outline" size="lg" fullWidth onClick={onClose}>
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
