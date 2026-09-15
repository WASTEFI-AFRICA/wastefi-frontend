'use client'

import { Users, UserCheck, MapPin, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface UserStatsProps {
  stats: {
    totalUsers: number
    activeCollectors: number
    collectionPoints: number
    adminUsers: number
    newUsersToday: number
    newUsersThisWeek: number
  }
}

export function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Users */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 font-medium">+{stats.newUsersToday} today</p>
          </div>
        </div>
      </Card>

      {/* Active Collectors */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Active Collectors</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeCollectors.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 font-medium">+{stats.newUsersThisWeek} this week</p>
          </div>
        </div>
      </Card>

      {/* Collection Points */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Collection Points</p>
            <p className="text-2xl font-bold text-gray-900">{stats.collectionPoints}</p>
            <p className="text-xs text-gray-600">Verified locations</p>
          </div>
        </div>
      </Card>

      {/* Admin Users */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Admin Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
            <p className="text-xs text-gray-600">System administrators</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
