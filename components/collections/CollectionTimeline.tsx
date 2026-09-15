"use client";

import { format } from "date-fns";
import { CheckCircle2, Clock, XCircle, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { CollectionStatus } from "@/types/api";

/**
 * Collection Timeline
 * Display collection status history
 */

interface TimelineEvent {
  status: CollectionStatus;
  timestamp: string;
  description: string;
}

interface CollectionTimelineProps {
  events: TimelineEvent[];
  currentStatus: CollectionStatus;
}

export function CollectionTimeline({ events, currentStatus }: CollectionTimelineProps) {
  const statusIcons = {
    pending: Clock,
    verified: CheckCircle2,
    rejected: XCircle,
    paid: DollarSign,
  };

  const statusColors = {
    pending: "text-[var(--warning)]",
    verified: "text-[var(--success)]",
    rejected: "text-[var(--error)]",
    paid: "text-[var(--primary)]",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => {
            const Icon = statusIcons[event.status];
            const isLast = index === events.length - 1;
            const isCurrent = event.status === currentStatus;

            return (
              <div key={index} className="relative">
                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-[var(--border)]" />
                )}

                {/* Event */}
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCurrent
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--muted)]"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isCurrent ? "text-white" : statusColors[event.status]
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium capitalize">{event.status}</p>
                      {isCurrent && (
                        <span className="text-xs text-[var(--primary)] font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] mb-1">
                      {event.description}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {format(new Date(event.timestamp), "MMM dd, yyyy • HH:mm")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
