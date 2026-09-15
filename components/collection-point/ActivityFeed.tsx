"use client";

import { formatDistanceToNow } from "date-fns";
import { Package, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";

/**
 * Activity Feed
 * Display recent collection activities
 */

type ActivityType = "submission" | "verification" | "rejection";

interface Activity {
  id: string;
  type: ActivityType;
  collectorName: string;
  materialType: string;
  weight: number;
  timestamp: string;
  status?: "pending" | "verified" | "rejected";
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "submission":
        return <Package className="w-5 h-5 text-[var(--info)]" />;
      case "verification":
        return <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />;
      case "rejection":
        return <XCircle className="w-5 h-5 text-[var(--error)]" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "submission":
        return (
          <>
            <strong>{activity.collectorName}</strong> submitted {activity.weight}kg of{" "}
            <span className="capitalize">{activity.materialType}</span>
          </>
        );
      case "verification":
        return (
          <>
            Verified {activity.weight}kg {activity.materialType} from{" "}
            <strong>{activity.collectorName}</strong>
          </>
        );
      case "rejection":
        return (
          <>
            Rejected submission from <strong>{activity.collectorName}</strong>
          </>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {activities.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-[var(--muted)]/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{getActivityText(activity)}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  {activity.status && (
                    <Badge
                      variant={
                        activity.status === "verified"
                          ? "success"
                          : activity.status === "rejected"
                          ? "error"
                          : "warning"
                      }
                      size="sm"
                      className="capitalize"
                    >
                      {activity.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-[var(--muted-foreground)]">
            No recent activity
          </div>
        )}
      </CardContent>
    </Card>
  );
}
