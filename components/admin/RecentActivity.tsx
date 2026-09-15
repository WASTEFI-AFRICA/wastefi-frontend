'use client'

import { 
  UserPlus, 
  CheckCircle, 
  DollarSign, 
  AlertTriangle,
  Settings,
  Trash2 
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface Activity {
  id: string
  type: 'user_registered' | 'submission_verified' | 'payment_processed' | 'alert' | 'system_config' | 'user_deleted'
  title: string
  description: string
  timestamp: Date
  user?: string
  metadata?: Record<string, any>
}

interface RecentActivityProps {
  activities: Activity[]
  maxItems?: number
}

export function RecentActivity({ activities, maxItems = 10 }: RecentActivityProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'user_registered':
        return { icon: UserPlus, color: 'bg-blue-100 text-blue-600' }
      case 'submission_verified':
        return { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' }
      case 'payment_processed':
        return { icon: DollarSign, color: 'bg-purple-100 text-purple-600' }
      case 'alert':
        return { icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' }
      case 'system_config':
        return { icon: Settings, color: 'bg-gray-100 text-gray-600' }
      case 'user_deleted':
        return { icon: Trash2, color: 'bg-red-100 text-red-600' }
    }
  }

  const getActivityBadge = (type: Activity['type']) => {
    switch (type) {
      case 'user_registered':
        return { variant: 'default' as const, label: 'User' }
      case 'submission_verified':
        return { variant: 'success' as const, label: 'Verified' }
      case 'payment_processed':
        return { variant: 'primary' as const, label: 'Payment' }
      case 'alert':
        return { variant: 'warning' as const, label: 'Alert' }
      case 'system_config':
        return { variant: 'default' as const, label: 'System' }
      case 'user_deleted':
        return { variant: 'error' as const, label: 'Deleted' }
    }
  }

  const displayActivities = activities.slice(0, maxItems)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Recent Activity</h3>
          <p className="text-sm text-gray-600">Latest system events and actions</p>
        </div>
        <Badge variant="default" size="sm">
          {activities.length} events
        </Badge>
      </div>

      <div className="space-y-3">
        {displayActivities.map((activity) => {
          const iconConfig = getActivityIcon(activity.type)
          const Icon = iconConfig.icon
          const badge = getActivityBadge(activity.type)

          return (
            <div
              key={activity.id}
              className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${iconConfig.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                    <Badge variant={badge.variant} size="sm">
                      {badge.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatDate(activity.timestamp)}</span>
                    {activity.user && (
                      <>
                        <span>•</span>
                        <span>{activity.user}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Settings className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600">No recent activity</p>
        </div>
      )}
    </Card>
  )
}
