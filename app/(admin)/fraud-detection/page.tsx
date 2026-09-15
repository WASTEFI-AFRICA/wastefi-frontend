'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Container } from '@/components/layout/Container'
import {
  AlertsOverview,
  FraudAlertsList,
  SuspiciousActivityChart,
  RiskScoreCard,
  FlaggedUsers,
} from '@/components/fraud-detection'

// Type definition
type FraudAlert = {
  id: string
  type: 'duplicate_submission' | 'suspicious_pattern' | 'location_mismatch' | 'rapid_submissions' | 'unusual_amount'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  affectedUser: {
    id: string
    name: string
    email: string
  }
  detectedAt: Date
  status: 'open' | 'investigating' | 'resolved' | 'false_positive'
  confidence: number
}

// Mock data
const mockAlertStats = {
  critical: 3,
  high: 8,
  medium: 15,
  low: 22,
}

const mockFraudAlerts: FraudAlert[] = [
  {
    id: '1',
    type: 'duplicate_submission',
    severity: 'critical',
    title: 'Duplicate Submission Detected',
    description: 'User submitted identical waste materials with same weight within 30 minutes',
    affectedUser: {
      id: 'u1',
      name: 'John Kamau',
      email: 'john.kamau@example.com',
    },
    detectedAt: new Date('2024-02-14T10:30:00'),
    status: 'open',
    confidence: 95,
  },
  {
    id: '2',
    type: 'rapid_submissions',
    severity: 'high',
    title: 'Rapid Submission Pattern',
    description: '15 submissions made in 2 hours from different locations',
    affectedUser: {
      id: 'u2',
      name: 'Mary Wanjiku',
      email: 'mary.w@example.com',
    },
    detectedAt: new Date('2024-02-14T09:15:00'),
    status: 'open',
    confidence: 88,
  },
  {
    id: '3',
    type: 'location_mismatch',
    severity: 'high',
    title: 'Location Inconsistency',
    description: 'Submissions from locations 50km apart within 10 minutes',
    affectedUser: {
      id: 'u3',
      name: 'Peter Ochieng',
      email: 'peter.o@example.com',
    },
    detectedAt: new Date('2024-02-14T08:45:00'),
    status: 'investigating',
    confidence: 92,
  },
  {
    id: '4',
    type: 'unusual_amount',
    severity: 'medium',
    title: 'Unusually High Value',
    description: 'Submission value 300% higher than user average',
    affectedUser: {
      id: 'u4',
      name: 'Sarah Muthoni',
      email: 'sarah.m@example.com',
    },
    detectedAt: new Date('2024-02-14T07:20:00'),
    status: 'open',
    confidence: 76,
  },
  {
    id: '5',
    type: 'suspicious_pattern',
    severity: 'medium',
    title: 'Suspicious Behavior Pattern',
    description: 'Account activity matches known fraud patterns',
    affectedUser: {
      id: 'u5',
      name: 'James Kipchoge',
      email: 'james.k@example.com',
    },
    detectedAt: new Date('2024-02-13T16:30:00'),
    status: 'resolved',
    confidence: 68,
  },
  {
    id: '6',
    type: 'duplicate_submission',
    severity: 'low',
    title: 'Possible Duplicate',
    description: 'Similar submission detected, low confidence match',
    affectedUser: {
      id: 'u6',
      name: 'Grace Akinyi',
      email: 'grace.a@example.com',
    },
    detectedAt: new Date('2024-02-13T14:10:00'),
    status: 'false_positive',
    confidence: 45,
  },
]

const mockActivityData = [
  { date: 'Mon', count: 8 },
  { date: 'Tue', count: 12 },
  { date: 'Wed', count: 6 },
  { date: 'Thu', count: 15 },
  { date: 'Fri', count: 10 },
  { date: 'Sat', count: 4 },
  { date: 'Sun', count: 7 },
]

const mockFlaggedUsers = [
  {
    id: 'u1',
    name: 'John Kamau',
    email: 'john.kamau@example.com',
    phone: '+254712345678',
    riskScore: 92,
    flagCount: 5,
    lastIncident: new Date('2024-02-14'),
    reasons: ['Duplicate Submissions', 'Rapid Activity', 'Location Mismatch'],
  },
  {
    id: 'u2',
    name: 'Mary Wanjiku',
    email: 'mary.w@example.com',
    phone: '+254723456789',
    riskScore: 85,
    flagCount: 4,
    lastIncident: new Date('2024-02-14'),
    reasons: ['Rapid Submissions', 'Unusual Patterns'],
  },
  {
    id: 'u3',
    name: 'Peter Ochieng',
    email: 'peter.o@example.com',
    phone: '+254734567890',
    riskScore: 78,
    flagCount: 3,
    lastIncident: new Date('2024-02-14'),
    reasons: ['Location Mismatch', 'Time Anomaly'],
  },
  {
    id: 'u7',
    name: 'David Mutua',
    email: 'david.m@example.com',
    phone: '+254745678901',
    riskScore: 65,
    flagCount: 2,
    lastIncident: new Date('2024-02-13'),
    reasons: ['Unusual Amount', 'Pattern Match'],
  },
]

export default function FraudDetectionPage() {
  const [alerts, setAlerts] = useState(mockFraudAlerts)
  const [flaggedUsers] = useState(mockFlaggedUsers)

  const handleViewDetails = (alertId: string) => {
    console.log('View alert details:', alertId)
    // In production, open detail modal
  }

  const handleResolveAlert = (alertId: string, action: 'resolve' | 'false_positive') => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: (action === 'resolve' ? 'resolved' : 'false_positive') as FraudAlert['status'],
            }
          : alert
      )
    )
    console.log('Resolve alert:', { alertId, action })
  }

  const handleViewUser = (userId: string) => {
    console.log('View user:', userId)
    // In production, open user detail modal
  }

  const handleSuspendUser = (userId: string) => {
    if (confirm('Are you sure you want to suspend this user?')) {
      console.log('Suspend user:', userId)
      // In production, call API to suspend user
    }
  }

  return (
    <Container>
      <div className="space-y-6 pb-20 lg:pb-6">
        {/* Header */}
        <PageHeader
          title="Fraud Detection"
          description="Monitor and investigate suspicious activities"
        />

        {/* Overview Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Risk Score - Takes 1 column */}
          <div>
            <RiskScoreCard score={32} trend={-5.2} category="low" />
          </div>

          {/* Alerts Overview - Takes 3 columns */}
          <div className="lg:col-span-3">
            <AlertsOverview stats={mockAlertStats} />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <SuspiciousActivityChart data={mockActivityData} />
          </div>

          {/* Flagged Users - Takes 1 column */}
          <div>
            <FlaggedUsers
              users={flaggedUsers}
              onViewUser={handleViewUser}
              onSuspendUser={handleSuspendUser}
            />
          </div>
        </div>

        {/* Fraud Alerts List */}
        <FraudAlertsList
          alerts={alerts}
          onViewDetails={handleViewDetails}
          onResolve={handleResolveAlert}
        />
      </div>
    </Container>
  )
}
