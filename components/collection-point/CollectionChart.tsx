"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { TrendingUp } from "lucide-react";

/**
 * Collection Chart
 * Simple bar chart visualization for collections data
 */

interface ChartDataPoint {
  label: string;
  value: number;
}

interface CollectionChartProps {
  title: string;
  data: ChartDataPoint[];
  color?: string;
}

export function CollectionChart({
  title,
  data,
  color = "var(--primary)",
}: CollectionChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((point, index) => (
            <div key={index}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[var(--muted-foreground)]">{point.label}</span>
                <span className="font-semibold">{point.value}</span>
              </div>
              <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(point.value / maxValue) * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center text-[var(--muted-foreground)] py-8">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
