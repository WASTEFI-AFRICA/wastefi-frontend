'use client'

import { useState } from 'react'
import { X, Plus, Minus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface StockAdjustmentModalProps {
  isOpen: boolean
  onClose: () => void
  material: {
    id: string
    name: string
    currentStock: number
    unit: string
    maxCapacity: number
  } | null
  onConfirm: (materialId: string, adjustment: number, reason: string, notes: string) => void
}

const ADJUSTMENT_REASONS = [
  { value: 'collection', label: 'New Collection' },
  { value: 'sale', label: 'Sold to Buyer' },
  { value: 'transfer', label: 'Transfer to Another Location' },
  { value: 'damage', label: 'Damaged/Contaminated' },
  { value: 'recount', label: 'Inventory Recount' },
  { value: 'other', label: 'Other' },
]

export function StockAdjustmentModal({
  isOpen,
  onClose,
  material,
  onConfirm,
}: StockAdjustmentModalProps) {
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  if (!isOpen || !material) return null

  const adjustmentValue = adjustmentType === 'add' ? Number(amount) : -Number(amount)
  const newStock = material.currentStock + adjustmentValue
  const isValid = amount && Number(amount) > 0 && reason && newStock >= 0 && newStock <= material.maxCapacity

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      setShowConfirmation(true)
    }
  }

  const handleConfirm = () => {
    onConfirm(material.id, adjustmentValue, reason, notes)
    handleClose()
  }

  const handleClose = () => {
    setAdjustmentType('add')
    setAmount('')
    setReason('')
    setNotes('')
    setShowConfirmation(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Adjust Stock</h2>
            <p className="text-sm text-gray-600">{material.name}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showConfirmation ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Current Stock Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Current Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {material.currentStock} <span className="text-base font-normal">{material.unit}</span>
              </p>
            </div>

            {/* Adjustment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustmentType('add')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                    adjustmentType === 'add'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Plus className={`w-6 h-6 ${adjustmentType === 'add' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className={`font-medium ${adjustmentType === 'add' ? 'text-emerald-700' : 'text-gray-600'}`}>
                    Add Stock
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentType('remove')}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                    adjustmentType === 'remove'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Minus className={`w-6 h-6 ${adjustmentType === 'remove' ? 'text-red-600' : 'text-gray-400'}`} />
                  <span className={`font-medium ${adjustmentType === 'remove' ? 'text-red-700' : 'text-gray-600'}`}>
                    Remove Stock
                  </span>
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ({material.unit})
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.1"
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">Select reason</option>
                {ADJUSTMENT_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* New Stock Preview */}
            {amount && Number(amount) > 0 && (
              <div className={`p-4 rounded-lg ${newStock < 0 || newStock > material.maxCapacity ? 'bg-red-50' : 'bg-emerald-50'}`}>
                <p className="text-sm text-gray-600 mb-1">New Stock Level</p>
                <p className={`text-2xl font-bold ${newStock < 0 || newStock > material.maxCapacity ? 'text-red-600' : 'text-emerald-600'}`}>
                  {newStock} <span className="text-base font-normal">{material.unit}</span>
                </p>
                {newStock < 0 && (
                  <div className="mt-2 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">Stock cannot be negative</p>
                  </div>
                )}
                {newStock > material.maxCapacity && (
                  <div className="mt-2 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">Exceeds maximum capacity of {material.maxCapacity} {material.unit}</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-6">
            {/* Confirmation */}
            <div className="text-center py-4">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                adjustmentType === 'add' ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {adjustmentType === 'add' ? (
                  <Plus className="w-8 h-8 text-emerald-600" />
                ) : (
                  <Minus className="w-8 h-8 text-red-600" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Confirm Adjustment
              </h3>
              <p className="text-gray-600">
                Please review the changes before confirming
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Material</span>
                  <span className="font-semibold text-gray-900">{material.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Current Stock</span>
                  <span className="font-semibold text-gray-900">{material.currentStock} {material.unit}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Adjustment</span>
                  <span className={`font-semibold ${adjustmentType === 'add' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {adjustmentType === 'add' ? '+' : '-'}{amount} {material.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium text-gray-900">New Stock</span>
                  <span className="text-lg font-bold text-emerald-600">{newStock} {material.unit}</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Reason</p>
                <p className="font-medium text-gray-900">
                  {ADJUSTMENT_REASONS.find(r => r.value === reason)?.label}
                </p>
                {notes && (
                  <>
                    <p className="text-sm text-gray-600 mt-3 mb-1">Notes</p>
                    <p className="text-sm text-gray-700">{notes}</p>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1"
              >
                Confirm Adjustment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
