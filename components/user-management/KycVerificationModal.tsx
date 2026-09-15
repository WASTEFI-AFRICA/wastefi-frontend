'use client'

import { X, Check, XCircle, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

interface KycDocument {
  type: 'id_card' | 'passport' | 'selfie' | 'proof_of_address'
  url: string
  uploadedAt: Date
  status: 'pending' | 'approved' | 'rejected'
}

interface KycVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    name: string
    email: string
    phone: string
    kycStatus: 'verified' | 'pending' | 'rejected' | 'not_submitted'
    documents: KycDocument[]
  } | null
  onApprove: (userId: string, notes: string) => void
  onReject: (userId: string, reason: string) => void
}

export function KycVerificationModal({
  isOpen,
  onClose,
  user,
  onApprove,
  onReject,
}: KycVerificationModalProps) {
  if (!isOpen || !user) return null

  const [notes, setNotes] = React.useState('')
  const [rejectionReason, setRejectionReason] = React.useState('')
  const [showRejectForm, setShowRejectForm] = React.useState(false)

  const getDocumentLabel = (type: KycDocument['type']) => {
    switch (type) {
      case 'id_card':
        return 'ID Card'
      case 'passport':
        return 'Passport'
      case 'selfie':
        return 'Selfie'
      case 'proof_of_address':
        return 'Proof of Address'
    }
  }

  const getStatusVariant = (status: KycDocument['status']): 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'pending':
        return 'warning'
      case 'rejected':
        return 'error'
    }
  }

  const handleApprove = () => {
    onApprove(user.id, notes)
    handleClose()
  }

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(user.id, rejectionReason)
      handleClose()
    }
  }

  const handleClose = () => {
    setNotes('')
    setRejectionReason('')
    setShowRejectForm(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">KYC Verification</h2>
            <p className="text-sm text-gray-600">{user.name}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">KYC Status</p>
                <Badge
                  variant={
                    user.kycStatus === 'verified'
                      ? 'success'
                      : user.kycStatus === 'pending'
                      ? 'warning'
                      : user.kycStatus === 'rejected'
                      ? 'error'
                      : 'default'
                  }
                  size="sm"
                >
                  {user.kycStatus}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitted Documents</h3>
            {user.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.documents.map((doc, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {getDocumentLabel(doc.type)}
                          </h4>
                          <Badge variant={getStatusVariant(doc.status)} size="sm">
                            {doc.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          Uploaded {doc.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      View Document
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No documents submitted</p>
              </div>
            )}
          </div>

          {!showRejectForm ? (
            <>
              {/* Verification Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this verification..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(true)}
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  className="flex-1"
                  disabled={user.documents.length === 0}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve KYC
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Rejection Form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this KYC is being rejected..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  This reason will be shared with the user
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-700">
                  Rejecting KYC will notify the user and require them to resubmit documents
                </p>
              </div>

              {/* Rejection Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(false)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Confirm Rejection
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Add React import for useState
import React from 'react'
