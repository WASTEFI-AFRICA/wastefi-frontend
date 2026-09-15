'use client'

import { useState } from 'react'
import { X, AlertCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { PaymentMethodSelector, PaymentMethod } from './PaymentMethodSelector'
import { formatCurrency, formatDate } from '@/lib/utils'

interface PaymentFormProps {
  isOpen: boolean
  onClose: () => void
  payment: {
    id: string
    collectorName: string
    collectorPhone: string
    collectorId: string
    amount: number
    submissionCount: number
    submissionIds: string[]
    weight: number
    materials: string[]
  } | null
  onConfirm: (paymentId: string, method: PaymentMethod, details: any) => void
}

export function PaymentForm({ isOpen, onClose, payment, onConfirm }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [mobileNumber, setMobileNumber] = useState('')
  const [stellarAddress, setStellarAddress] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [bankName, setBankName] = useState('')
  const [notes, setNotes] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  if (!isOpen || !payment) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentMethod) return
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    if (!paymentMethod) return

    const details: any = { notes }

    switch (paymentMethod) {
      case 'mobile_money':
        details.mobileNumber = mobileNumber
        break
      case 'stellar':
        details.stellarAddress = stellarAddress
        break
      case 'bank_transfer':
        details.bankAccount = bankAccount
        details.bankName = bankName
        break
      case 'cash':
        // No additional details needed
        break
    }

    onConfirm(payment.id, paymentMethod, details)
    handleClose()
  }

  const handleClose = () => {
    setPaymentMethod(null)
    setMobileNumber('')
    setStellarAddress('')
    setBankAccount('')
    setBankName('')
    setNotes('')
    setShowConfirmation(false)
    onClose()
  }

  const isValid = () => {
    if (!paymentMethod) return false

    switch (paymentMethod) {
      case 'mobile_money':
        return mobileNumber.length >= 10
      case 'stellar':
        return stellarAddress.length > 0
      case 'bank_transfer':
        return bankAccount.length > 0 && bankName.length > 0
      case 'cash':
        return true
      default:
        return false
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Process Payment</h2>
            <p className="text-sm text-gray-600">Complete payment to collector</p>
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
            {/* Collector Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{payment.collectorName}</p>
                  <p className="text-sm text-gray-600">{payment.collectorPhone}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t flex items-center gap-4 text-sm text-gray-600">
                <span>{payment.submissionCount} submissions</span>
                <span>•</span>
                <span>{payment.weight.toFixed(1)} kg</span>
              </div>
            </div>

            {/* Payment Method */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
            />

            {/* Payment Details */}
            {paymentMethod === 'mobile_money' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <Input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+254712345678"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the collector's mobile money number
                </p>
              </div>
            )}

            {paymentMethod === 'stellar' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stellar Address *
                </label>
                <Input
                  type="text"
                  value={stellarAddress}
                  onChange={(e) => setStellarAddress(e.target.value)}
                  placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the collector's Stellar wallet address
                </p>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <Input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g., Equity Bank"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <Input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="Enter account number"
                    required
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Cash Payment</p>
                  <p className="text-sm text-blue-700">
                    Please ensure you have {formatCurrency(payment.amount)} in cash ready for
                    the collector
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any payment notes..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid()} className="flex-1">
                Continue
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-6">
            {/* Confirmation */}
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Payment</h3>
              <p className="text-gray-600">Please review payment details before confirming</p>
            </div>

            {/* Payment Summary */}
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Collector</span>
                  <span className="font-semibold text-gray-900">{payment.collectorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phone</span>
                  <span className="font-semibold text-gray-900">{payment.collectorPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Submissions</span>
                  <span className="font-semibold text-gray-900">{payment.submissionCount}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-medium text-gray-900">Amount</span>
                  <span className="text-xl font-bold text-emerald-600">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Method</span>
                  <Badge variant="primary" size="sm">
                    {paymentMethod?.replace('_', ' ')}
                  </Badge>
                </div>
                {paymentMethod === 'mobile_money' && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mobile Number</span>
                    <span className="font-semibold text-gray-900">{mobileNumber}</span>
                  </div>
                )}
                {paymentMethod === 'stellar' && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Stellar Address</span>
                    <span className="font-mono text-xs text-gray-900">
                      {stellarAddress.slice(0, 8)}...{stellarAddress.slice(-8)}
                    </span>
                  </div>
                )}
                {paymentMethod === 'bank_transfer' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bank</span>
                      <span className="font-semibold text-gray-900">{bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Account</span>
                      <span className="font-semibold text-gray-900">{bankAccount}</span>
                    </div>
                  </>
                )}
                {notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600 mb-1">Notes</p>
                    <p className="text-sm text-gray-900">{notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Warning */}
            <div className="p-4 bg-orange-50 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-700">
                This action cannot be undone. Please ensure all details are correct.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button onClick={handleConfirm} className="flex-1">
                Confirm Payment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
