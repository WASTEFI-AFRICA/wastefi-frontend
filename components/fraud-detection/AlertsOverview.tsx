'use client'

import { AlertTriangle, AlertCircle, ShieldAlert, Info } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface AlertsOverviewProps {
  stats: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

export function AlertsOverview({ stats }: AlertsOverviewProps) {
  const totalAlerts = stats.critical + stats.high + stats.medium + stats.low

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Critical */}
      <Card className="p-4 border-red-200 bg-red-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-red-600 font-medium mb-0.5">Critical</p>
            <p className="text-2xl font-bold text-red-700">{stats.critical}</p>
          </div>
        </div>
      </Card>

      {/* High */}
      <Card className="p-4 border-orange-200 bg-orange-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-orange-600 font-medium mb-0.5">High</p>
            <p className="text-2xl font-bold text-orange-700">{stats.high}</p>
          </div>
        </div>
      </Card>

      {/* Medium */}
      <Card className="p-4 border-yellow-200 bg-yellow-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-yellow-600 font-medium mb-0.5">Medium</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.medium}</p>
          </div>
        </div>
      </Card>

      {/* Low */}
      <Card className="p-4 border-blue-200 bg-blue-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-blue-600 font-medium mb-0.5">Low</p>
            <p className="text-2xl font-bold text-blue-700">{stats.low}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
