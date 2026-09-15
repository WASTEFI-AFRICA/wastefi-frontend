'use client'

import { AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface LowStockAlertProps {
  materials: Array<{
    id: string
    name: string
    currentStock: number
    minThreshold: number
    unit: string
  }>
  onViewDetails: (materialId: string) => void
  onDismiss: () => void
}

export function LowStockAlert({ materials, onViewDetails, onDismiss }: LowStockAlertProps) {
  if (materials.length === 0) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-red-900 mb-1">
            Low Stock Alert
          </h3>
          <p className="text-sm text-red-700 mb-3">
            {materials.length} {materials.length === 1 ? 'material is' : 'materials are'} below minimum threshold
          </p>
          <div className="space-y-2">
            {materials.map((material) => (
              <div
                key={material.id}
                className="flex items-center justify-between p-2 bg-white rounded border border-red-100"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm">{material.name}</p>
                  <p className="text-xs text-gray-600">
                    Current: {material.currentStock} {material.unit} / Min: {material.minThreshold} {material.unit}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(material.id)}
                  className="ml-3 flex-shrink-0"
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  )
}
