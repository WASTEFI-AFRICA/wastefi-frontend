'use client'

import { useState } from 'react'
import { Clock, DollarSign, User, ChevronRight, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'

interface PendingPayment {
  id: string
  collectorName: string
  collectorPhone: string
  collectorId: string
  amount: number
  submissionCount: number
  submissionIds: string[]
  weight: number
  materials: string[]
  createdAt: Date
  priority: 'high' | 'normal'
}

interface PaymentQueueProps {
  payments: PendingPayment[]
  selectedIds: string[]
  onSelectPayment: (paymentId: string) => void
  onSelectAll: () => void
  onProcessPayment: (payment: PendingPayment) => void
}

export function PaymentQueue({
  payments,
  selectedIds,
  onSelectPayment,
  onSelectAll,
  onProcessPayment,
}: PaymentQueueProps) {
  const allSelected = payments.length > 0 && selectedIds.length === payments.length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Pending Payments ({payments.length})
        </h2>
        {payments.length > 0 && (
          <button
            onClick={onSelectAll}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        )}
      </div>

      {/* Payment List */}
      {payments.length > 0 ? (
        <div className="space-y-3">
          {payments.map((payment) => {
            const isSelected = selectedIds.includes(payment.id)
            return (
              <Card
                key={payment.id}
                className={`transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50' : 'hover:shadow-md'
                }`}
                onClick={() => onSelectPayment(payment.id)}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {payment.collectorName}
                            </h3>
                            {payment.priority === 'high' && (
                              <Badge variant="error" size="sm">
                                Priority
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{payment.collectorPhone}</p>
                        </div>
                        <div className="text-right ml-3 flex-shrink-0">
                          <p className="text-xl font-bold text-emerald-600">
                            {formatCurrency(payment.amount)}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{payment.submissionCount} submissions</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>{payment.weight.toFixed(1)} kg</span>
                        </div>
                      </div>

                      {/* Materials */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {payment.materials.slice(0, 3).map((material, idx) => (
                          <Badge key={idx} variant="default" size="sm">
                            {material}
                          </Badge>
                        ))}
                        {payment.materials.length > 3 && (
                          <Badge variant="default" size="sm">
                            +{payment.materials.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <p className="text-xs text-gray-500">
                          Pending since {formatDate(payment.createdAt)}
                        </p>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onProcessPayment(payment)
                          }}
                        >
                          Process Payment
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Pending Payments
          </h3>
          <p className="text-gray-600">
            All verified submissions have been paid
          </p>
        </Card>
      )}
    </div>
  )
}
