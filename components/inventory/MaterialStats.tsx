'use client'

import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface MaterialStatsProps {
  stats: {
    totalMaterials: number
    totalValue: number
    lowStockCount: number
    totalWeight: number
  }
}

export function MaterialStats({ stats }: MaterialStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Materials */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Material Types</p>
            <p className="text-xl font-bold text-gray-900 truncate">
              {stats.totalMaterials}
            </p>
          </div>
        </div>
      </Card>

      {/* Total Value */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Total Value</p>
            <p className="text-xl font-bold text-emerald-600 truncate">
              ${stats.totalValue.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      {/* Low Stock Items */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Low Stock</p>
            <p className="text-xl font-bold text-orange-600 truncate">
              {stats.lowStockCount}
            </p>
          </div>
        </div>
      </Card>

      {/* Total Weight */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Total Weight</p>
            <p className="text-xl font-bold text-gray-900 truncate">
              {stats.totalWeight.toFixed(1)} kg
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
