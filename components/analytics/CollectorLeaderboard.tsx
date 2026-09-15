'use client'

import { Trophy, Medal, Award } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Collector {
  id: string
  name: string
  phone: string
  totalWeight: number
  totalValue: number
  submissionCount: number
  rank: number
}

interface CollectorLeaderboardProps {
  collectors: Collector[]
}

export function CollectorLeaderboard({ collectors }: CollectorLeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600">{rank}</span>
          </div>
        )
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 2:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case 3:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-white'
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Collectors</h3>
        <Badge variant="default" size="sm">This Month</Badge>
      </div>

      <div className="space-y-3">
        {collectors.map((collector) => (
          <div
            key={collector.id}
            className={`p-4 rounded-lg border transition-all ${getRankBadge(collector.rank)}`}
          >
            <div className="flex items-center gap-3">
              {/* Rank Icon */}
              <div className="flex-shrink-0">
                {getRankIcon(collector.rank)}
              </div>

              {/* Collector Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 truncate">{collector.name}</h4>
                  {collector.rank <= 3 && (
                    <Badge
                      variant={collector.rank === 1 ? 'success' : 'default'}
                      size="sm"
                    >
                      #{collector.rank}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{collector.phone}</p>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Weight</p>
                    <p className="font-semibold text-gray-900">{collector.totalWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Value</p>
                    <p className="font-semibold text-emerald-600">${collector.totalValue}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Submissions</p>
                    <p className="font-semibold text-gray-900">{collector.submissionCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {collectors.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No collector data available</p>
        </div>
      )}
    </Card>
  )
}
