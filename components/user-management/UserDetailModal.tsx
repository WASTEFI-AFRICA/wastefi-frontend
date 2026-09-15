'use client'

import { X, Mail, Phone, Calendar, MapPin, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

interface UserDetailModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    name: string
    email: string
    phone: string
    role: 'collector' | 'collection_point' | 'admin'
    status: 'active' | 'inactive' | 'suspended'
    kycStatus: 'verified' | 'pending' | 'rejected' | 'not_submitted'
    registeredAt: Date
    lastActive: Date
    stats?: {
      totalSubmissions?: number
      totalWeight?: number
      totalEarnings?: number
      successRate?: number
    }
    location?: string
  } | null
  onVerifyKyc: (userId: string) => void
}

export function UserDetailModal({ isOpen, onClose, user, onVerifyKyc }: UserDetailModalProps) {
  if (!isOpen || !user) return null

  const getStatusVariant = (status: typeof user.status): 'success' | 'default' | 'error' => {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'default'
      case 'suspended':
        return 'error'
    }
  }

  const getRoleLabel = (role: typeof user.role) => {
    switch (role) {
      case 'collector':
        return 'Collector'
      case 'collection_point':
        return 'Collection Point'
      case 'admin':
        return 'Admin'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Details</h2>
            <p className="text-sm text-gray-600">{user.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Overview */}
          <Card className="p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={getStatusVariant(user.status)} size="sm">
                  {user.status}
                </Badge>
                <Badge variant="default" size="sm">
                  {getRoleLabel(user.role)}
                </Badge>
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
                  KYC: {user.kycStatus}
                </Badge>
              </div>
              {user.kycStatus === 'pending' && (
                <Button size="sm" onClick={() => onVerifyKyc(user.id)}>
                  Verify KYC
                </Button>
              )}
            </div>
          </Card>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
                {user.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{user.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Activity Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Registered</p>
                    <p className="font-medium text-gray-900">{formatDate(user.registeredAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Last Active</p>
                    <p className="font-medium text-gray-900">{formatDate(user.lastActive)}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats (for collectors) */}
          {user.role === 'collector' && user.stats && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-gray-500 mb-1">Submissions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.stats.totalSubmissions || 0}
                  </p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-500 mb-1">Total Weight</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.stats.totalWeight || 0} kg
                  </p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ${user.stats.totalEarnings || 0}
                  </p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-500 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.stats.successRate || 0}%
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button className="flex-1">Edit User</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
