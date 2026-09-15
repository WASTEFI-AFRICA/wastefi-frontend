'use client'

import { Check, Clock, X, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Payment {
  id: string
  collectorName: string
  collectorPhone: string
  amount: number
  method: string
  status: 'completed' | 'pending' | 'failed'
  processedAt: Date
  processedBy: string
  submissionCount: number
}

interface PaymentHistoryProps {
  payments: Payment[]
  onViewDetails: (paymentId: string) => void
}

export function PaymentHistory({ payments, onViewDetails }: PaymentHistoryProps) {
  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'failed':
        return <X className="w-4 h-4" />
    }
  }

  const getStatusVariant = (status: Payment['status']): 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'failed':
        return 'error'
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Payment History ({payments.length})
      </h2>

      {payments.length > 0 ? (
        <div className="space-y-3">
          {payments.map((payment) => (
            <Card
              key={payment.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onViewDetails(payment.id)}
            >
              <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    payment.status === 'completed'
                      ? 'bg-emerald-100'
                      : payment.status === 'pending'
                      ? 'bg-orange-100'
                      : 'bg-red-100'
                  }`}
                >
                  <div
                    className={
                      payment.status === 'completed'
                        ? 'text-emerald-600'
                        : payment.status === 'pending'
                        ? 'text-orange-600'
                        : 'text-red-600'
                    }
                  >
                    {getStatusIcon(payment.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {payment.collectorName}
                      </h3>
                      <p className="text-sm text-gray-600">{payment.collectorPhone}</p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant={getStatusVariant(payment.status)} size="sm">
                      {payment.status}
                    </Badge>
                    <Badge variant="default" size="sm">
                      {payment.method}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {payment.submissionCount} submissions
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-xs text-gray-500">
                    <span>
                      {formatDate(payment.processedAt)} by {payment.processedBy}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment History</h3>
          <p className="text-gray-600">Payment history will appear here</p>
        </Card>
      )}
    </div>
  )
}
