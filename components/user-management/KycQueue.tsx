'use client'

import { Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

interface KycSubmission {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  submittedAt: Date
  documentCount: number
  priority: 'high' | 'normal' | 'low'
}

interface KycQueueProps {
  submissions: KycSubmission[]
  onReview: (userId: string) => void
}

export function KycQueue({ submissions, onReview }: KycQueueProps) {
  const getPriorityColor = (priority: KycSubmission['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'normal':
        return 'text-orange-600'
      case 'low':
        return 'text-gray-600'
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">KYC Review Queue</h3>
          <p className="text-sm text-gray-600">Pending verification requests</p>
        </div>
        <Badge variant="warning" size="sm">
          {submissions.length} pending
        </Badge>
      </div>

      {submissions.length > 0 ? (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{submission.userName}</h4>
                    {submission.priority === 'high' && (
                      <Badge variant="error" size="sm">
                        High Priority
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{submission.userEmail}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{submission.documentCount} documents</span>
                    <span>•</span>
                    <span>Submitted {formatDate(submission.submittedAt)}</span>
                  </div>
                </div>
                <Button size="sm" onClick={() => onReview(submission.userId)}>
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-1">All Caught Up!</h4>
          <p className="text-gray-600">No pending KYC verifications</p>
        </div>
      )}
    </Card>
  )
}
