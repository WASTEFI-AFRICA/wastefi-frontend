'use client'

import { useState } from 'react'
import { DollarSign, Users, TrendingUp, CheckCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  PaymentQueue,
  PaymentForm,
  PaymentHistory,
  BulkPaymentModal,
  PaymentMethod,
} from '@/components/payment'

// Mock data
const mockPendingPayments = [
  {
    id: '1',
    collectorName: 'John Kamau',
    collectorPhone: '+254712345678',
    collectorId: 'c001',
    amount: 125.5,
    submissionCount: 3,
    submissionIds: ['sub1', 'sub2', 'sub3'],
    weight: 45.2,
    materials: ['PET Plastic', 'Aluminum Cans', 'Cardboard'],
    createdAt: new Date('2024-02-10'),
    priority: 'high' as const,
  },
  {
    id: '2',
    collectorName: 'Mary Wanjiku',
    collectorPhone: '+254723456789',
    collectorId: 'c002',
    amount: 89.75,
    submissionCount: 2,
    submissionIds: ['sub4', 'sub5'],
    weight: 32.1,
    materials: ['Glass Bottles', 'Office Paper'],
    createdAt: new Date('2024-02-12'),
    priority: 'normal' as const,
  },
  {
    id: '3',
    collectorName: 'Peter Ochieng',
    collectorPhone: '+254734567890',
    collectorId: 'c003',
    amount: 210.0,
    submissionCount: 5,
    submissionIds: ['sub6', 'sub7', 'sub8', 'sub9', 'sub10'],
    weight: 78.5,
    materials: ['Steel Scrap', 'Copper Wire', 'Aluminum Cans', 'HDPE Plastic'],
    createdAt: new Date('2024-02-09'),
    priority: 'high' as const,
  },
]

const mockPaymentHistory = [
  {
    id: 'ph1',
    collectorName: 'Sarah Muthoni',
    collectorPhone: '+254745678901',
    amount: 156.25,
    method: 'Mobile Money',
    status: 'completed' as const,
    processedAt: new Date('2024-02-13'),
    processedBy: 'Admin',
    submissionCount: 4,
  },
  {
    id: 'ph2',
    collectorName: 'James Kipchoge',
    collectorPhone: '+254756789012',
    amount: 98.5,
    method: 'Stellar',
    status: 'completed' as const,
    processedAt: new Date('2024-02-13'),
    processedBy: 'Admin',
    submissionCount: 2,
  },
  {
    id: 'ph3',
    collectorName: 'Grace Akinyi',
    collectorPhone: '+254767890123',
    amount: 178.0,
    method: 'Bank Transfer',
    status: 'pending' as const,
    processedAt: new Date('2024-02-14'),
    processedBy: 'Admin',
    submissionCount: 3,
  },
]

export default function PaymentsPage() {
  const [pendingPayments, setPendingPayments] = useState(mockPendingPayments)
  const [paymentHistory, setPaymentHistory] = useState(mockPaymentHistory)
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<string[]>([])
  const [selectedPayment, setSelectedPayment] = useState<typeof mockPendingPayments[0] | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)

  // Calculate stats
  const stats = {
    pendingCount: pendingPayments.length,
    pendingAmount: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
    processedToday: paymentHistory.filter(
      (p) => p.processedAt.toDateString() === new Date().toDateString()
    ).length,
    completedAmount: paymentHistory
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
  }

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPaymentIds((prev) =>
      prev.includes(paymentId)
        ? prev.filter((id) => id !== paymentId)
        : [...prev, paymentId]
    )
  }

  const handleSelectAll = () => {
    if (selectedPaymentIds.length === pendingPayments.length) {
      setSelectedPaymentIds([])
    } else {
      setSelectedPaymentIds(pendingPayments.map((p) => p.id))
    }
  }

  const handleProcessPayment = (payment: typeof mockPendingPayments[0]) => {
    setSelectedPayment(payment)
    setShowPaymentForm(true)
  }

  const handleConfirmPayment = (
    paymentId: string,
    method: PaymentMethod,
    details: any
  ) => {
    // Remove from pending
    const payment = pendingPayments.find((p) => p.id === paymentId)
    if (payment) {
      setPendingPayments((prev) => prev.filter((p) => p.id !== paymentId))

      // Add to history
      setPaymentHistory((prev) => [
        {
          id: `ph${Date.now()}`,
          collectorName: payment.collectorName,
          collectorPhone: payment.collectorPhone,
          amount: payment.amount,
          method: method.replace('_', ' '),
          status: 'completed' as const,
          processedAt: new Date(),
          processedBy: 'Admin',
          submissionCount: payment.submissionCount,
        },
        ...prev,
      ])

      setSelectedPaymentIds((prev) => prev.filter((id) => id !== paymentId))
    }

    // In production, send to API
    console.log('Payment processed:', { paymentId, method, details })
  }

  const handleBulkPayment = () => {
    if (selectedPaymentIds.length > 0) {
      setShowBulkModal(true)
    }
  }

  const handleConfirmBulkPayment = () => {
    // Process all selected payments
    const selectedPayments = pendingPayments.filter((p) =>
      selectedPaymentIds.includes(p.id)
    )

    selectedPayments.forEach((payment) => {
      setPaymentHistory((prev) => [
        {
          id: `ph${Date.now()}-${payment.id}`,
          collectorName: payment.collectorName,
          collectorPhone: payment.collectorPhone,
          amount: payment.amount,
          method: 'Mobile Money',
          status: 'completed' as const,
          processedAt: new Date(),
          processedBy: 'Admin',
          submissionCount: payment.submissionCount,
        },
        ...prev,
      ])
    })

    setPendingPayments((prev) =>
      prev.filter((p) => !selectedPaymentIds.includes(p.id))
    )
    setSelectedPaymentIds([])
    setShowBulkModal(false)

    // In production, send to API
    console.log('Bulk payment processed:', selectedPaymentIds)
  }

  const handleViewPaymentDetails = (paymentId: string) => {
    console.log('View payment details:', paymentId)
    // In production, open payment detail modal
  }

  const totalSelectedAmount = pendingPayments
    .filter((p) => selectedPaymentIds.includes(p.id))
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <Container>
      <div className="space-y-6 pb-20 lg:pb-6">
        {/* Header */}
        <PageHeader
          title="Payment Processing"
          description="Process payments to waste collectors"
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-xl font-bold text-gray-900">{stats.pendingCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending Amount</p>
                <p className="text-xl font-bold text-gray-900">
                  ${stats.pendingAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Processed Today</p>
                <p className="text-xl font-bold text-gray-900">{stats.processedToday}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-xl font-bold text-emerald-600">
                  ${stats.completedAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bulk Actions */}
        {selectedPaymentIds.length > 0 && (
          <Card className="p-4 bg-emerald-50 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-emerald-900">
                  {selectedPaymentIds.length} payment(s) selected
                </p>
                <p className="text-sm text-emerald-700">
                  Total: ${totalSelectedAmount.toFixed(2)}
                </p>
              </div>
              <Button onClick={handleBulkPayment}>Process Selected</Button>
            </div>
          </Card>
        )}

        {/* Pending Payments Queue */}
        <PaymentQueue
          payments={pendingPayments}
          selectedIds={selectedPaymentIds}
          onSelectPayment={handleSelectPayment}
          onSelectAll={handleSelectAll}
          onProcessPayment={handleProcessPayment}
        />

        {/* Payment History */}
        <PaymentHistory
          payments={paymentHistory}
          onViewDetails={handleViewPaymentDetails}
        />
      </div>

      {/* Payment Form Modal */}
      <PaymentForm
        isOpen={showPaymentForm}
        onClose={() => {
          setShowPaymentForm(false)
          setSelectedPayment(null)
        }}
        payment={selectedPayment}
        onConfirm={handleConfirmPayment}
      />

      {/* Bulk Payment Modal */}
      <BulkPaymentModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        paymentCount={selectedPaymentIds.length}
        totalAmount={totalSelectedAmount}
        onConfirm={handleConfirmBulkPayment}
      />
    </Container>
  )
}
