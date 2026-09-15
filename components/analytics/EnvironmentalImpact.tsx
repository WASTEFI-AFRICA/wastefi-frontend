'use client'

import { Leaf, Droplets, Zap, TreeDeciduous } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface ImpactMetric {
  label: string
  value: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface EnvironmentalImpactProps {
  metrics: ImpactMetric[]
}

export function EnvironmentalImpact({ metrics }: EnvironmentalImpactProps) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Environmental Impact</h3>
        <p className="text-sm text-gray-600">Positive impact from waste collection this month</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${metric.color} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <p className="text-sm font-medium text-gray-900 mb-1">{metric.label}</p>
                  <p className="text-xs text-gray-600">{metric.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Impact Summary */}
      <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="w-5 h-5 text-emerald-600" />
          <h4 className="font-semibold text-emerald-900">Making a Difference</h4>
        </div>
        <p className="text-sm text-emerald-700">
          Your collection point has helped divert waste from landfills, reducing environmental
          pollution and contributing to a circular economy.
        </p>
      </div>
    </Card>
  )
}
