'use client'

import { Package, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface InventoryCardProps {
  material: {
    id: string
    name: string
    type: string
    currentStock: number
    unit: string
    minThreshold: number
    maxCapacity: number
    lastUpdated: Date
    valuePerUnit: number
  }
  onAdjust: (materialId: string) => void
}

export function InventoryCard({ material, onAdjust }: InventoryCardProps) {
  const stockPercentage = (material.currentStock / material.maxCapacity) * 100
  const isLowStock = material.currentStock <= material.minThreshold
  const isNearCapacity = stockPercentage >= 80

  const getStatusColor = () => {
    if (isLowStock) return 'text-red-600'
    if (isNearCapacity) return 'text-orange-600'
    return 'text-green-600'
  }

  const getStockStatus = () => {
    if (isLowStock) return 'Low Stock'
    if (isNearCapacity) return 'Near Capacity'
    return 'Healthy'
  }

  const totalValue = material.currentStock * material.valuePerUnit

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Package className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{material.name}</h3>
            <p className="text-sm text-gray-600">{material.type}</p>
          </div>
        </div>
        <Badge variant={isLowStock ? 'error' : 'success'} size="sm">
          {getStockStatus()}
        </Badge>
      </div>

      {/* Stock Level Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-600">Stock Level</span>
          <span className={`text-sm font-semibold ${getStatusColor()}`}>
            {stockPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              isLowStock
                ? 'bg-red-500'
                : isNearCapacity
                ? 'bg-orange-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Stock Details */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500">Current Stock</p>
          <p className="text-lg font-bold text-gray-900">
            {material.currentStock} <span className="text-sm font-normal">{material.unit}</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Total Value</p>
          <p className="text-lg font-bold text-emerald-600">
            ${totalValue.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Min Threshold</p>
          <p className="text-sm font-semibold text-gray-700">
            {material.minThreshold} {material.unit}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Max Capacity</p>
          <p className="text-sm font-semibold text-gray-700">
            {material.maxCapacity} {material.unit}
          </p>
        </div>
      </div>

      {/* Low Stock Warning */}
      {isLowStock && (
        <div className="mb-3 p-2 bg-red-50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-xs text-red-700">
            Stock below minimum threshold. Consider processing soon.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t">
        <p className="text-xs text-gray-500">
          Updated {new Date(material.lastUpdated).toLocaleDateString()}
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAdjust(material.id)}
        >
          Adjust Stock
        </Button>
      </div>
    </Card>
  )
}
