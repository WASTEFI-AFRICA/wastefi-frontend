'use client'

import { useState } from 'react'
import { AlertTriangle, Eye, CheckCircle, XCircle, Filter } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

interface FraudAlert {
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

interface FraudAlertsListProps {
  alerts: FraudAlert[]
  onViewDetails: (alertId: string) => void
  onResolve: (alertId: string, action: 'resolve' | 'false_positive') => void
}

export function FraudAlertsList({ alerts, onViewDetails, onResolve }: FraudAlertsListProps) {
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter
    return matchesSeverity && matchesStatus
  })

  const getSeverityColor = (severity: FraudAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50'
      case 'high':
        return 'border-orange-200 bg-orange-50'
      case 'medium':
        return 'border-yellow-200 bg-yellow-50'
      case 'low':
        return 'border-blue-200 bg-blue-50'
    }
  }

  const getSeverityBadge = (severity: FraudAlert['severity']): 'error' | 'warning' | 'default' => {
    switch (severity) {
      case 'critical':
        return 'error'
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'default'
    }
  }

  const getStatusVariant = (status: FraudAlert['status']): 'warning' | 'success' | 'default' => {
    switch (status) {
      case 'open':
        return 'warning'
      case 'investigating':
        return 'warning'
      case 'resolved':
        return 'success'
      case 'false_positive':
        return 'default'
    }
  }

  const getTypeLabel = (type: FraudAlert['type']) => {
    switch (type) {
      case 'duplicate_submission':
        return 'Duplicate Submission'
      case 'suspicious_pattern':
        return 'Suspicious Pattern'
      case 'location_mismatch':
        return 'Location Mismatch'
      case 'rapid_submissions':
        return 'Rapid Submissions'
      case 'unusual_amount':
        return 'Unusual Amount'
    }
  }

  return (
    <Card className="overflow-hidden">
      {/* Header with Filters */}
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Fraud Alerts</h3>
            <p className="text-sm text-gray-600">Review and investigate suspicious activities</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="relative flex-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="false_positive">False Positive</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-3">
          Showing {filteredAlerts.length} of {alerts.length} alerts
        </p>
      </div>

      {/* Alerts List */}
      <div className="divide-y">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-6 transition-colors hover:bg-gray-50 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-white border-2 border-current flex items-center justify-center">
                  <AlertTriangle
                    className={`w-5 h-5 ${
                      alert.severity === 'critical' || alert.severity === 'high'
                        ? 'text-red-600'
                        : alert.severity === 'medium'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                      <Badge variant={getSeverityBadge(alert.severity)} size="sm">
                        {alert.severity}
                      </Badge>
                      <Badge variant={getStatusVariant(alert.status)} size="sm">
                        {alert.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <span className="font-medium">{getTypeLabel(alert.type)}</span>
                      <span>•</span>
                      <span>User: {alert.affectedUser.name}</span>
                      <span>•</span>
                      <span>Confidence: {alert.confidence}%</span>
                      <span>•</span>
                      <span>{formatDate(alert.detectedAt)}</span>
                    </div>
                  </div>
                </div>

                {alert.status === 'open' && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails(alert.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Investigate
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onResolve(alert.id, 'resolve')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onResolve(alert.id, 'false_positive')}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      False Positive
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">No Alerts Found</h4>
            <p className="text-gray-600">
              {alerts.length === 0
                ? 'All systems are operating normally'
                : 'Try adjusting your filters'}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
