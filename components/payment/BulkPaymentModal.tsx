'use client'

import { X, AlertCircle, Check, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

interface BulkPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  paymentCount: number
  totalAmount: number
  onConfirm: () => void
}

export function BulkPaymentModal({
  isOpen,
  onClose,
  paymentCount,
  totalAmount,
  onConfirm,
}: BulkPaymentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Bulk Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Icon */}
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Process Bulk Payment
            </h3>
            <p className="text-gray-600">
              You are about to process multiple payments at once
            </p>
          </div>

          {/* Summary */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Number of Payments</span>
              <span className="text-lg font-bold text-gray-900">{paymentCount}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-sm font-medium text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-emerald-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-orange-50 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-900 mb-1">Important</p>
              <p className="text-sm text-orange-700">
                All {paymentCount} payments will be processed using their default payment methods.
                This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onConfirm} className="flex-1">
              Process {paymentCount} Payments
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
