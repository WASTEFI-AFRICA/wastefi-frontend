"use client";

import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";

/**
 * Top Collectors
 * Display top performing collectors
 */

interface CollectorStats {
  id: string;
  name: string;
  collections: number;
  weight: number;
  avatar?: string;
}

interface TopCollectorsProps {
  collectors: CollectorStats[];
}

export function TopCollectors({ collectors }: TopCollectorsProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "#FFD700"; // Gold
      case 1:
        return "#C0C0C0"; // Silver
      case 2:
        return "#CD7F32"; // Bronze
      default:
        return "var(--muted-foreground)";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Top Collectors
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {collectors.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {collectors.map((collector, index) => (
              <div key={collector.id} className="p-4 flex items-center gap-4">
                {/* Rank */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{
                    backgroundColor: `${getRankColor(index)}20`,
                    color: getRankColor(index),
                  }}
                >
                  #{index + 1}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {collector.avatar ? (
                    <img
                      src={collector.avatar}
                      alt={collector.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(collector.name)
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{collector.name}</p>
                  <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)] mt-0.5">
                    <span>{collector.collections} collections</span>
                    <span>•</span>
                    <span>{collector.weight.toFixed(1)} kg</span>
                  </div>
                </div>

                {/* Badge for top 3 */}
                {index < 3 && (
                  <Trophy
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: getRankColor(index) }}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-[var(--muted-foreground)]">
            No collectors yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
