'use client'

import { Card } from '@/components/ui/Card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface RevenueChartProps {
  data: Array<{
    date: string
    revenue: number
  }>
  period: 'week' | 'month' | 'quarter' | 'year'
}

export function RevenueChart({ data, period }: RevenueChartProps) {
  if (data.length === 0) return null

  const maxRevenue = Math.max(...data.map(d => d.revenue))
  const minRevenue = Math.min(...data.map(d => d.revenue))
  const avgRevenue = data.reduce((sum, d) => sum + d.revenue, 0) / data.length

  // Calculate trend
  const recentAvg = data.slice(-3).reduce((sum, d) => sum + d.revenue, 0) / 3
  const previousAvg = data.slice(0, 3).reduce((sum, d) => sum + d.revenue, 0) / 3
  const trend = ((recentAvg - previousAvg) / previousAvg) * 100

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Revenue Overview</h3>
          <p className="text-sm text-gray-600">
            {period === 'week' ? 'Last 7 days' : period === 'month' ? 'Last 30 days' : period === 'quarter' ? 'Last 3 months' : 'Last 12 months'}
          </p>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(trend).toFixed(1)}%
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48 mb-4">
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {data.map((item, index) => {
            const height = (item.revenue / maxRevenue) * 100
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center relative group">
                  <div
                    className="w-full bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600 cursor-pointer"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      ${item.revenue.toFixed(2)}
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
          <p className="text-xs text-gray-500 mb-1">Average</p>
          <p className="text-lg font-bold text-gray-900">${avgRevenue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Highest</p>
          <p className="text-lg font-bold text-emerald-600">${maxRevenue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Lowest</p>
          <p className="text-lg font-bold text-orange-600">${minRevenue.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  )
}
