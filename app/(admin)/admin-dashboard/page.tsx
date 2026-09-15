'use client'

import { Server, Database, Activity, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Container } from '@/components/layout/Container'
import {
  SystemOverview,
  UserStats,
  RecentActivity,
  PlatformMetrics,
  QuickActions,
} from '@/components/admin'

// Mock data
const mockSystemMetrics = [
  {
    label: 'API Server',
    value: '99.9% Uptime',
    status: 'healthy' as const,
    description: 'All endpoints responding normally',
    icon: Server,
  },
  {
    label: 'Database',
    value: '45% Usage',
    status: 'healthy' as const,
    description: '2.4 TB of 5.3 TB used',
    icon: Database,
  },
  {
    label: 'Response Time',
    value: '124ms',
    status: 'healthy' as const,
    description: 'Average API response time',
    icon: Activity,
  },
  {
    label: 'Error Rate',
    value: '0.02%',
    status: 'healthy' as const,
    description: '12 errors in last 24 hours',
    icon: AlertCircle,
  },
]

const mockUserStats = {
  totalUsers: 5847,
  activeCollectors: 2341,
  collectionPoints: 87,
  adminUsers: 12,
  newUsersToday: 23,
  newUsersThisWeek: 156,
}

const mockPlatformMetrics = {
  totalSubmissions: 45789,
  submissionsToday: 342,
  totalRevenue: 125680,
  revenueThisMonth: 8945,
  avgProcessingTime: '2.4h',
  systemUptime: '99.9%',
}

const mockRecentActivity = [
  {
    id: '1',
    type: 'user_registered' as const,
    title: 'New Collector Registered',
    description: 'John Kamau completed registration and phone verification',
    timestamp: new Date('2024-02-14T10:30:00'),
    user: 'System',
  },
  {
    id: '2',
    type: 'submission_verified' as const,
    title: 'Submission Verified',
    description: 'Collection Point #7 verified 45.2kg of PET plastic',
    timestamp: new Date('2024-02-14T10:15:00'),
    user: 'Admin #3',
  },
  {
    id: '3',
    type: 'payment_processed' as const,
    title: 'Payment Processed',
    description: '$125.50 paid to Mary Wanjiku via M-Pesa',
    timestamp: new Date('2024-02-14T09:45:00'),
    user: 'Collection Point #5',
  },
  {
    id: '4',
    type: 'alert' as const,
    title: 'Low Stock Alert',
    description: 'Collection Point #3 has low stock of Glass Bottles',
    timestamp: new Date('2024-02-14T09:20:00'),
    user: 'System',
  },
  {
    id: '5',
    type: 'system_config' as const,
    title: 'System Configuration Updated',
    description: 'Material pricing rates updated for Q1 2024',
    timestamp: new Date('2024-02-14T08:30:00'),
    user: 'Super Admin',
  },
  {
    id: '6',
    type: 'user_registered' as const,
    title: 'New Collection Point Added',
    description: 'Green Earth Recycling registered as collection point',
    timestamp: new Date('2024-02-14T08:00:00'),
    user: 'Admin #2',
  },
  {
    id: '7',
    type: 'payment_processed' as const,
    title: 'Bulk Payment Completed',
    description: '15 collectors paid totaling $2,340.75',
    timestamp: new Date('2024-02-13T16:45:00'),
    user: 'Collection Point #2',
  },
  {
    id: '8',
    type: 'submission_verified' as const,
    title: 'Batch Verification',
    description: '8 submissions verified totaling 156.4kg',
    timestamp: new Date('2024-02-13T15:30:00'),
    user: 'Admin #1',
  },
]

export default function AdminDashboardPage() {
  return (
    <Container>
      <div className="space-y-6 pb-20 lg:pb-6">
        {/* Header */}
        <PageHeader
          title="Admin Dashboard"
          description="System overview and management"
        />

        {/* User Stats */}
        <UserStats stats={mockUserStats} />

        {/* Platform Metrics */}
        <PlatformMetrics metrics={mockPlatformMetrics} />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Overview - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <SystemOverview metrics={mockSystemMetrics} />
            <QuickActions />
          </div>

          {/* Recent Activity - Takes 1 column */}
          <div>
            <RecentActivity activities={mockRecentActivity} maxItems={8} />
          </div>
        </div>
      </div>
    </Container>
  )
}
