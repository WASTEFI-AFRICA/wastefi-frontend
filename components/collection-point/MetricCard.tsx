"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

/**
 * Metric Card
 * Display a single metric with icon and trend
 */

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "var(--primary)",
}: MetricCardProps) {
  const isPositiveTrend = trend && trend.value > 0;
  const isNegativeTrend = trend && trend.value < 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-[var(--muted-foreground)] mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-[var(--muted-foreground)] mt-1">{subtitle}</p>
            )}
          </div>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>

        {trend && (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                isPositiveTrend
                  ? "text-[var(--success)]"
                  : isNegativeTrend
                  ? "text-[var(--error)]"
                  : "text-[var(--muted-foreground)]"
              }`}
            >
              {isPositiveTrend ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
