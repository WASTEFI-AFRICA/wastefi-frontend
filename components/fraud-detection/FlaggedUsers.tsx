'use client'

import { UserX, Eye, Ban } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface FlaggedUser {
  id: string
  name: string
  email: string
  phone: string
  riskScore: number
  flagCount: number
  lastIncident: Date
  reasons: string[]
}

interface FlaggedUsersProps {
  users: FlaggedUser[]
  onViewUser: (userId: string) => void
  onSuspendUser: (userId: string) => void
}

export function FlaggedUsers({ users, onViewUser, onSuspendUser }: FlaggedUsersProps) {
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600'
    if (score >= 60) return 'text-orange-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getRiskBg = (score: number) => {
    if (score >= 80) return 'bg-red-100'
    if (score >= 60) return 'bg-orange-100'
    if (score >= 40) return 'bg-yellow-100'
    return 'bg-gray-100'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Flagged Users</h3>
          <p className="text-sm text-gray-600">Users with high-risk scores</p>
        </div>
        <Badge variant="error" size="sm">
          {users.length} flagged
        </Badge>
      </div>

      {users.length > 0 ? (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${getRiskBg(user.riskScore)} flex items-center justify-center flex-shrink-0`}>
                  <UserX className={`w-5 h-5 ${getRiskColor(user.riskScore)}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{user.name}</h4>
                    <span className={`text-lg font-bold ${getRiskColor(user.riskScore)}`}>
                      {user.riskScore}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{user.email}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {user.reasons.slice(0, 2).map((reason, idx) => (
                      <Badge key={idx} variant="error" size="sm">
                        {reason}
                      </Badge>
                    ))}
                    {user.reasons.length > 2 && (
                      <Badge variant="error" size="sm">
                        +{user.reasons.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{user.flagCount} flags</span>
                    <span>Last: {user.lastIncident.toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewUser(user.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSuspendUser(user.id)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Ban className="w-4 h-4 mr-1" />
                      Suspend
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <UserX className="w-6 h-6 text-emerald-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">No Flagged Users</h4>
          <p className="text-gray-600">All users have clean records</p>
        </div>
      )}
    </Card>
  )
}
