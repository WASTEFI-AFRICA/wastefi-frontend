"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui";
import {
  AchievementCard,
  LeaderboardList,
  MilestoneProgress,
  StatsOverview,
  AchievementDetail,
} from "@/components/achievements";
import type { Achievement, LeaderboardEntry, UserStats } from "@/types/achievements";

/**
 * Achievements Page
 * Display achievements, leaderboard, and user stats
 */

// Mock user stats
const mockUserStats: UserStats = {
  totalCollections: 47,
  totalWeight: 156.8,
  totalEarnings: 342.50,
  currentStreak: 7,
  longestStreak: 14,
  referrals: 3,
  achievementsUnlocked: 8,
  totalPoints: 1250,
  rank: 42,
};

// Mock achievements
const mockAchievements: Achievement[] = [
  {
    id: "ach-001",
    title: "First Steps",
    description: "Complete your first waste collection",
    category: "collections",
    tier: "bronze",
    icon: "👣",
    requirement: { type: "collections", target: 1 },
    reward: { points: 50 },
    unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 1,
  },
  {
    id: "ach-002",
    title: "Dedicated Collector",
    description: "Complete 10 waste collections",
    category: "collections",
    tier: "silver",
    icon: "📦",
    requirement: { type: "collections", target: 10 },
    reward: { points: 100, bonus: 5 },
    unlockedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 10,
  },
  {
    id: "ach-003",
    title: "Collection Master",
    description: "Complete 50 waste collections",
    category: "collections",
    tier: "gold",
    icon: "🏆",
    requirement: { type: "collections", target: 50 },
    reward: { points: 250, bonus: 15 },
    progress: 47,
  },
  {
    id: "ach-004",
    title: "Heavy Lifter",
    description: "Collect 100kg of waste",
    category: "environmental",
    tier: "silver",
    icon: "💪",
    requirement: { type: "weight", target: 100 },
    reward: { points: 150, bonus: 10 },
    unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 156.8,
  },
  {
    id: "ach-005",
    title: "Eco Warrior",
    description: "Collect 500kg of waste",
    category: "environmental",
    tier: "gold",
    icon: "🌍",
    requirement: { type: "weight", target: 500 },
    reward: { points: 500, bonus: 25 },
    progress: 156.8,
  },
  {
    id: "ach-006",
    title: "First Earnings",
    description: "Earn your first $10",
    category: "earnings",
    tier: "bronze",
    icon: "💰",
    requirement: { type: "earnings", target: 10 },
    reward: { points: 50 },
    unlockedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 342.50,
  },
  {
    id: "ach-007",
    title: "Money Maker",
    description: "Earn $100 from collections",
    category: "earnings",
    tier: "silver",
    icon: "💵",
    requirement: { type: "earnings", target: 100 },
    reward: { points: 200, bonus: 10 },
    unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 342.50,
  },
  {
    id: "ach-008",
    title: "Big Earner",
    description: "Earn $500 from collections",
    category: "earnings",
    tier: "gold",
    icon: "💎",
    requirement: { type: "earnings", target: 500 },
    reward: { points: 500, bonus: 50 },
    progress: 342.50,
  },
  {
    id: "ach-009",
    title: "Week Warrior",
    description: "Maintain a 7-day collection streak",
    category: "collections",
    tier: "silver",
    icon: "🔥",
    requirement: { type: "streak", target: 7 },
    reward: { points: 150, bonus: 10 },
    unlockedAt: new Date().toISOString(),
    progress: 7,
  },
  {
    id: "ach-010",
    title: "Community Builder",
    description: "Refer 5 friends to WasteFi",
    category: "social",
    tier: "gold",
    icon: "👥",
    requirement: { type: "referrals", target: 5 },
    reward: { points: 300, bonus: 20 },
    progress: 3,
  },
];

// Mock leaderboard
const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "user-001",
    name: "Emma Johnson",
    stats: {
      totalCollections: 156,
      totalWeight: 523.4,
      totalEarnings: 1245.50,
      achievementCount: 15,
    },
  },
  {
    rank: 2,
    userId: "user-002",
    name: "Michael Chen",
    stats: {
      totalCollections: 142,
      totalWeight: 489.2,
      totalEarnings: 1156.25,
      achievementCount: 14,
    },
  },
  {
    rank: 3,
    userId: "user-003",
    name: "Sarah Williams",
    stats: {
      totalCollections: 128,
      totalWeight: 445.8,
      totalEarnings: 1034.75,
      achievementCount: 13,
    },
  },
  {
    rank: 42,
    userId: "user-123",
    name: "John Doe",
    stats: {
      totalCollections: 47,
      totalWeight: 156.8,
      totalEarnings: 342.50,
      achievementCount: 8,
    },
    isCurrentUser: true,
  },
];

type TabType = "achievements" | "leaderboard";

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("achievements");
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const unlockedAchievements = mockAchievements.filter((a) => a.unlockedAt);
  const lockedAchievements = mockAchievements.filter((a) => !a.unlockedAt);
  
  // Find next milestone (closest locked achievement)
  const nextMilestone = lockedAchievements.sort((a, b) => {
    const progressA = (a.progress || 0) / a.requirement.target;
    const progressB = (b.progress || 0) / b.requirement.target;
    return progressB - progressA;
  })[0];

  return (
    <Container>
      <Section>
        <PageHeader
          title="Achievements"
          description="Track your progress and compete with others"
        />
      </Section>

      <Section spacing="sm">
        {/* Stats Overview */}
        <StatsOverview stats={mockUserStats} />

        {/* Next Milestone */}
        {nextMilestone && (
          <MilestoneProgress
            achievement={nextMilestone}
            currentValue={nextMilestone.progress || 0}
          />
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-[var(--border)]">
          <Button
            variant={activeTab === "achievements" ? "primary" : "outline"}
            size="md"
            onClick={() => setActiveTab("achievements")}
            className="rounded-b-none"
          >
            Achievements ({mockAchievements.length})
          </Button>
          <Button
            variant={activeTab === "leaderboard" ? "primary" : "outline"}
            size="md"
            onClick={() => setActiveTab("leaderboard")}
            className="rounded-b-none"
          >
            Leaderboard
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "achievements" ? (
          <div className="space-y-6">
            {/* Unlocked Achievements */}
            {unlockedAchievements.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">
                  Unlocked ({unlockedAchievements.length})
                </h3>
                <div className="space-y-3">
                  {unlockedAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      onClick={() => setSelectedAchievement(achievement)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Locked Achievements */}
            {lockedAchievements.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">
                  In Progress ({lockedAchievements.length})
                </h3>
                <div className="space-y-3">
                  {lockedAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      onClick={() => setSelectedAchievement(achievement)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <LeaderboardList entries={mockLeaderboard} />
        )}
      </Section>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <AchievementDetail
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </Container>
  );
}
