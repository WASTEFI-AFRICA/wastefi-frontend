'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import {
  UserTable,
  KycVerificationModal,
  UserDetailModal,
  KycQueue,
} from '@/components/user-management'

// Type definition
type User = {
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
    totalSubmissions: number
    totalWeight: number
    totalEarnings: number
    successRate: number
  }
  location?: string
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Kamau',
    email: 'john.kamau@example.com',
    phone: '+254712345678',
    role: 'collector' as const,
    status: 'active' as const,
    kycStatus: 'verified' as const,
    registeredAt: new Date('2024-01-15'),
    lastActive: new Date('2024-02-14'),
    stats: {
      totalSubmissions: 45,
      totalWeight: 342.5,
      totalEarnings: 1250.75,
      successRate: 95,
    },
    location: 'Nairobi, Kenya',
  },
  {
    id: '2',
    name: 'Mary Wanjiku',
    email: 'mary.w@example.com',
    phone: '+254723456789',
    role: 'collector' as const,
    status: 'active' as const,
    kycStatus: 'pending' as const,
    registeredAt: new Date('2024-01-20'),
    lastActive: new Date('2024-02-13'),
    stats: {
      totalSubmissions: 38,
      totalWeight: 298.2,
      totalEarnings: 1089.5,
      successRate: 92,
    },
    location: 'Nairobi, Kenya',
  },
  {
    id: '3',
    name: 'Green Earth Recycling',
    email: 'contact@greenearth.co.ke',
    phone: '+254734567890',
    role: 'collection_point' as const,
    status: 'active' as const,
    kycStatus: 'verified' as const,
    registeredAt: new Date('2023-12-01'),
    lastActive: new Date('2024-02-14'),
    location: 'Westlands, Nairobi',
  },
  {
    id: '4',
    name: 'Peter Ochieng',
    email: 'peter.o@example.com',
    phone: '+254745678901',
    role: 'collector' as const,
    status: 'inactive' as const,
    kycStatus: 'not_submitted' as const,
    registeredAt: new Date('2024-02-01'),
    lastActive: new Date('2024-02-05'),
    stats: {
      totalSubmissions: 12,
      totalWeight: 89.3,
      totalEarnings: 325.8,
      successRate: 88,
    },
    location: 'Nairobi, Kenya',
  },
  {
    id: '5',
    name: 'Sarah Muthoni',
    email: 'sarah.m@example.com',
    phone: '+254756789012',
    role: 'collector' as const,
    status: 'suspended' as const,
    kycStatus: 'rejected' as const,
    registeredAt: new Date('2024-01-10'),
    lastActive: new Date('2024-02-01'),
    stats: {
      totalSubmissions: 23,
      totalWeight: 167.4,
      totalEarnings: 612.3,
      successRate: 78,
    },
    location: 'Nairobi, Kenya',
  },
  {
    id: '6',
    name: 'Admin User',
    email: 'admin@wastefi.com',
    phone: '+254767890123',
    role: 'admin' as const,
    status: 'active' as const,
    kycStatus: 'verified' as const,
    registeredAt: new Date('2023-11-01'),
    lastActive: new Date('2024-02-14'),
  },
  {
    id: '7',
    name: 'EcoPoint Recyclers',
    email: 'info@ecopoint.co.ke',
    phone: '+254778901234',
    role: 'collection_point' as const,
    status: 'active' as const,
    kycStatus: 'pending' as const,
    registeredAt: new Date('2024-02-10'),
    lastActive: new Date('2024-02-14'),
    location: 'Karen, Nairobi',
  },
  {
    id: '8',
    name: 'James Kipchoge',
    email: 'james.k@example.com',
    phone: '+254789012345',
    role: 'collector' as const,
    status: 'active' as const,
    kycStatus: 'verified' as const,
    registeredAt: new Date('2024-01-25'),
    lastActive: new Date('2024-02-14'),
    stats: {
      totalSubmissions: 31,
      totalWeight: 234.1,
      totalEarnings: 852.8,
      successRate: 94,
    },
    location: 'Nairobi, Kenya',
  },
]

const mockKycQueue = [
  {
    id: 'kyc1',
    userId: '2',
    userName: 'Mary Wanjiku',
    userEmail: 'mary.w@example.com',
    userPhone: '+254723456789',
    submittedAt: new Date('2024-02-13'),
    documentCount: 3,
    priority: 'high' as const,
  },
  {
    id: 'kyc2',
    userId: '7',
    userName: 'EcoPoint Recyclers',
    userEmail: 'info@ecopoint.co.ke',
    userPhone: '+254778901234',
    submittedAt: new Date('2024-02-12'),
    documentCount: 4,
    priority: 'normal' as const,
  },
]

const mockKycDocuments = [
  {
    type: 'id_card' as const,
    url: '/docs/id-card.jpg',
    uploadedAt: new Date('2024-02-13'),
    status: 'pending' as const,
  },
  {
    type: 'selfie' as const,
    url: '/docs/selfie.jpg',
    uploadedAt: new Date('2024-02-13'),
    status: 'pending' as const,
  },
  {
    type: 'proof_of_address' as const,
    url: '/docs/proof-address.pdf',
    uploadedAt: new Date('2024-02-13'),
    status: 'pending' as const,
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [kycQueue, setKycQueue] = useState(mockKycQueue)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [showKycModal, setShowKycModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const selectedUser = selectedUserId ? users.find((u) => u.id === selectedUserId) : null

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId)
    setShowDetailModal(true)
  }

  const handleEditUser = (userId: string) => {
    console.log('Edit user:', userId)
    // In production, open edit modal
  }

  const handleSuspendUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === 'suspended' ? 'active' : 'suspended',
            }
          : user
      )
    )
    console.log('Toggle suspend user:', userId)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((user) => user.id !== userId))
      console.log('Delete user:', userId)
    }
  }

  const handleVerifyKyc = (userId: string) => {
    setSelectedUserId(userId)
    setShowKycModal(true)
  }

  const handleApproveKyc = (userId: string, notes: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, kycStatus: 'verified' as const } : user
      )
    )
    setKycQueue((prev) => prev.filter((item) => item.userId !== userId))
    console.log('Approve KYC:', { userId, notes })
  }

  const handleRejectKyc = (userId: string, reason: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, kycStatus: 'rejected' as const } : user
      )
    )
    setKycQueue((prev) => prev.filter((item) => item.userId !== userId))
    console.log('Reject KYC:', { userId, reason })
  }

  return (
    <Container>
      <div className="space-y-6 pb-20 lg:pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <PageHeader title="User Management" description="Manage users and KYC verification" />
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* KYC Queue */}
        <KycQueue submissions={kycQueue} onReview={handleVerifyKyc} />

        {/* User Table */}
        <UserTable
          users={users}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onSuspendUser={handleSuspendUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>

      {/* KYC Verification Modal */}
      {selectedUser && (
        <KycVerificationModal
          isOpen={showKycModal}
          onClose={() => {
            setShowKycModal(false)
            setSelectedUserId(null)
          }}
          user={{
            id: selectedUser.id,
            name: selectedUser.name,
            email: selectedUser.email,
            phone: selectedUser.phone,
            kycStatus: selectedUser.kycStatus,
            documents: mockKycDocuments,
          }}
          onApprove={handleApproveKyc}
          onReject={handleRejectKyc}
        />
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedUserId(null)
          }}
          user={selectedUser}
          onVerifyKyc={handleVerifyKyc}
        />
      )}
    </Container>
  )
}
