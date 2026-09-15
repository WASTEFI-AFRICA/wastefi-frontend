'use client'

import { Shield, TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface RiskScoreCardProps {
  score: number
  trend: number
  category: 'low' | 'medium' | 'high' | 'critical'
}

export function RiskScoreCard({ score, trend, category }: RiskScoreCardProps) {
  const getScoreColor = (category: RiskScoreCardProps['category']) => {
    switch (category) {
      case 'low':
        return 'text-emerald-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-orange-600'
      case 'critical':
        return 'text-red-600'
    }
  }

  const getScoreBg = (category: RiskScoreCardProps['category']) => {
    switch (category) {
      case 'low':
        return 'bg-emerald-100'
      case 'medium':
        return 'bg-yellow-100'
      case 'high':
        return 'bg-orange-100'
      case 'critical':
        return 'bg-red-100'
    }
  }

  const getScoreBorder = (category: RiskScoreCardProps['category']) => {
    switch (category) {
      case 'low':
        return 'border-emerald-200'
      case 'medium':
        return 'border-yellow-200'
      case 'high':
        return 'border-orange-200'
      case 'critical':
        return 'border-red-200'
    }
  }

  const getScoreLabel = (category: RiskScoreCardProps['category']) => {
    switch (category) {
      case 'low':
        return 'Low Risk'
      case 'medium':
        return 'Medium Risk'
      case 'high':
        return 'High Risk'
      case 'critical':
        return 'Critical Risk'
    }
  }

  return (
    <Card className={`p-6 border-2 ${getScoreBorder(category)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${getScoreBg(category)} flex items-center justify-center`}>
          <Shield className={`w-6 h-6 ${getScoreColor(category)}`} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
          {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(trend)}%
        </div>
      </div>

      <h3 className="text-sm font-medium text-gray-600 mb-2">Platform Risk Score</h3>
      <div className="flex items-baseline gap-2 mb-3">
        <p className={`text-4xl font-bold ${getScoreColor(category)}`}>{score}</p>
        <p className="text-lg text-gray-500">/ 100</p>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${getScoreColor(category)}`}>
          {getScoreLabel(category)}
        </span>
        {trend >= 0 ? (
          <span className="text-xs text-red-600">↑ Increasing</span>
        ) : (
          <span className="text-xs text-emerald-600">↓ Decreasing</span>
        )}
      </div>

      {/* Risk Bar */}
      <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${
            category === 'low'
              ? 'bg-emerald-500'
              : category === 'medium'
              ? 'bg-yellow-500'
              : category === 'high'
              ? 'bg-orange-500'
              : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </Card>
  )
}
