'use client'

import { Card } from '@/components/ui/Card'

interface MaterialBreakdownProps {
  data: Array<{
    material: string
    weight: number
    percentage: number
    color: string
  }>
}

export function MaterialBreakdown({ data }: MaterialBreakdownProps) {
  const totalWeight = data.reduce((sum, item) => sum + item.weight, 0)

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Material Breakdown</h3>

      {/* Horizontal Bar Chart */}
      <div className="space-y-4 mb-6">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">{item.material}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{item.weight.toFixed(1)} kg</span>
                <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
              </div>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="pt-4 border-t flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Total Weight</span>
        <span className="text-xl font-bold text-gray-900">{totalWeight.toFixed(1)} kg</span>
      </div>
    </Card>
  )
}
