/**
 * Achievement and Gamification Types
 */

export type AchievementCategory = "collections" | "earnings" | "environmental" | "social";

export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  icon: string;
  requirement: {
    type: "collections" | "weight" | "earnings" | "streak" | "referrals";
    target: number;
  };
  reward: {
    points: number;
    bonus?: number; // USD bonus
  };
  unlockedAt?: string;
  progress?: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  stats: {
    totalCollections: number;
    totalWeight: number;
    totalEarnings: number;
    achievementCount: number;
  };
  isCurrentUser?: boolean;
}

export interface UserStats {
  totalCollections: number;
  totalWeight: number;
  totalEarnings: number;
  currentStreak: number;
  longestStreak: number;
  referrals: number;
  achievementsUnlocked: number;
  totalPoints: number;
  rank: number;
  nextMilestone?: {
    achievement: Achievement;
    progress: number;
  };
}
