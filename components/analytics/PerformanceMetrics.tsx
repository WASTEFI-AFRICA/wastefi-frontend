'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface Metric {
  label: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
}

interface PerformanceMetricsProps {
  metrics: Metric[]
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const getTrendIcon = (trend: Metric['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />
      case 'down':
        return <TrendingDown className="w-4 h-4" />
      case 'neutral':
        return <Minus className="w-4 h-4" />
    }
  }

  const getTrendColor = (trend: Metric['trend']) => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600'
      case 'down':
        return 'text-red-600'
      case 'neutral':
        return 'text-gray-600'
    }
  }

  const getIconBgColor = (index: number) => {
    const colors = ['bg-blue-100', 'bg-emerald-100', 'bg-purple-100', 'bg-orange-100']
    return colors[index % colors.length]
  }

  const getIconColor = (index: number) => {
    const colors = ['text-blue-600', 'text-emerald-600', 'text-purple-600', 'text-orange-600']
    return colors[index % colors.length]
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconBgColor(index)}`}>
                <Icon className={`w-5 h-5 ${getIconColor(index)}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(metric.trend)}`}>
                {getTrendIcon(metric.trend)}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </Card>
        )
      })}
    </div>
  )
}
