'use client'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface SuspiciousActivityChartProps {
  data: Array<{
    date: string
    count: number
  }>
}

export function SuspiciousActivityChart({ data }: SuspiciousActivityChartProps) {
  if (data.length === 0) return null

  const maxCount = Math.max(...data.map((d) => d.count))
  const totalCount = data.reduce((sum, d) => sum + d.count, 0)
  const avgCount = totalCount / data.length

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Suspicious Activity Trend
          </h3>
          <p className="text-sm text-gray-600">Last 7 days</p>
        </div>
        <Badge variant="warning" size="sm">
          {totalCount} incidents
        </Badge>
      </div>

      {/* Chart */}
      <div className="relative h-48 mb-4">
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {data.map((item, index) => {
            const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center relative group">
                  <div
                    className="w-full bg-orange-500 rounded-t-lg transition-all hover:bg-orange-600 cursor-pointer"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {item.count} alerts
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 truncate w-full text-center">
                  {item.date}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div>
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="text-lg font-bold text-gray-900">{totalCount}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Average</p>
          <p className="text-lg font-bold text-gray-900">{avgCount.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Peak</p>
          <p className="text-lg font-bold text-orange-600">{maxCount}</p>
        </div>
      </div>
    </Card>
  )
}
