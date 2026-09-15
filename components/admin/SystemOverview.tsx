'use client'

import { Server, Database, Activity, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface SystemMetric {
  label: string
  value: string
  status: 'healthy' | 'warning' | 'error'
  description: string
  icon: React.ComponentType<{ className?: string }>
}

interface SystemOverviewProps {
  metrics: SystemMetric[]
}

export function SystemOverview({ metrics }: SystemOverviewProps) {
  const getStatusColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'warning':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200'
    }
  }

  const getStatusBadge = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy':
        return { variant: 'success' as const, label: 'Healthy' }
      case 'warning':
        return { variant: 'warning' as const, label: 'Warning' }
      case 'error':
        return { variant: 'error' as const, label: 'Error' }
    }
  }

  const getIconColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-emerald-600'
      case 'warning':
        return 'text-orange-600'
      case 'error':
        return 'text-red-600'
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">System Health</h3>
          <p className="text-sm text-gray-600">Real-time system status monitoring</p>
        </div>
        <Badge variant="success" size="sm">
          All Systems Operational
        </Badge>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const statusBadge = getStatusBadge(metric.status)
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${getIconColor(metric.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{metric.label}</h4>
                    <Badge variant={statusBadge.variant} size="sm">
                      {statusBadge.label}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <p className="text-sm text-gray-700">{metric.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
