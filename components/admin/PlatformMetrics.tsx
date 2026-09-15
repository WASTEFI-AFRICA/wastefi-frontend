'use client'

import { Package, TrendingUp, DollarSign, Zap } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface PlatformMetricsProps {
  metrics: {
    totalSubmissions: number
    submissionsToday: number
    totalRevenue: number
    revenueThisMonth: number
    avgProcessingTime: string
    systemUptime: string
  }
}

export function PlatformMetrics({ metrics }: PlatformMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Submissions */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Total Submissions</p>
            <p className="text-2xl font-bold text-gray-900">
              {metrics.totalSubmissions.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <TrendingUp className="w-3 h-3 text-emerald-600" />
          <span className="text-emerald-600 font-medium">+{metrics.submissionsToday}</span>
          <span className="text-gray-500">today</span>
        </div>
      </Card>

      {/* Total Revenue */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ${metrics.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <TrendingUp className="w-3 h-3 text-emerald-600" />
          <span className="text-emerald-600 font-medium">${metrics.revenueThisMonth.toLocaleString()}</span>
          <span className="text-gray-500">this month</span>
        </div>
      </Card>

      {/* Avg Processing Time */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Avg Processing</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.avgProcessingTime}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">Per submission</p>
      </Card>

      {/* System Uptime */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">System Uptime</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.systemUptime}</p>
          </div>
        </div>
        <p className="text-xs text-emerald-600 font-medium">Excellent</p>
      </Card>
    </div>
  )
}
