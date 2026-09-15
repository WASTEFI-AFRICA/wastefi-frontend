'use client'

import { Calendar } from 'lucide-react'

export type TimeRange = 'week' | 'month' | 'quarter' | 'year'

interface TimeRangeSelectorProps {
  selected: TimeRange
  onChange: (range: TimeRange) => void
}

const TIME_RANGES: Array<{ value: TimeRange; label: string }> = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'year', label: 'Year' },
]

export function TimeRangeSelector({ selected, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-5 h-5 text-gray-400" />
      <div className="flex bg-gray-100 rounded-lg p-1">
        {TIME_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => onChange(range.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              selected === range.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  )
}
