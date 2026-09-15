'use client'

import { useState } from 'react'
import { BarChart3, Users, DollarSign, Package, Leaf, Droplets, Zap, TreeDeciduous } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Container } from '@/components/layout/Container'
import {
  RevenueChart,
  MaterialBreakdown,
  PerformanceMetrics,
  CollectorLeaderboard,
  EnvironmentalImpact,
  TimeRangeSelector,
  TimeRange,
} from '@/components/analytics'

// Mock data generators
const generateRevenueData = (period: TimeRange) => {
  const days = period === 'week' ? 7 : period === 'month' ? 30 : period === 'quarter' ? 90 : 365
  return Array.from({ length: Math.min(days, 30) }, (_, i) => ({
    date: period === 'week' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] || `Day ${i + 1}`
      : period === 'month'
      ? `${i + 1}`
      : period === 'quarter'
      ? `W${i + 1}`
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i] || `M${i + 1}`,
    revenue: Math.random() * 500 + 200,
  }))
}

const mockMaterialData = [
  { material: 'PET Plastic', weight: 285.5, percentage: 32, color: '#3b82f6' },
  { material: 'Aluminum Cans', weight: 210.3, percentage: 24, color: '#8b5cf6' },
  { material: 'Cardboard', weight: 178.7, percentage: 20, color: '#f59e0b' },
  { material: 'Glass Bottles', weight: 132.1, percentage: 15, color: '#10b981' },
  { material: 'Steel Scrap', weight: 80.4, percentage: 9, color: '#ef4444' },
]

const mockPerformanceMetrics = [
  {
    label: 'Total Collections',
    value: '1,247',
    change: 12.5,
    trend: 'up' as const,
    icon: Package,
  },
  {
    label: 'Active Collectors',
    value: '89',
    change: 8.3,
    trend: 'up' as const,
    icon: Users,
  },
  {
    label: 'Total Revenue',
    value: '$8,456',
    change: 15.2,
    trend: 'up' as const,
    icon: DollarSign,
  },
  {
    label: 'Avg. Collection',
    value: '6.8 kg',
    change: 3.1,
    trend: 'down' as const,
    icon: BarChart3,
  },
]

const mockTopCollectors = [
  {
    id: '1',
    name: 'John Kamau',
    phone: '+254712345678',
    totalWeight: 342.5,
    totalValue: 1250.75,
    submissionCount: 45,
    rank: 1,
  },
  {
    id: '2',
    name: 'Mary Wanjiku',
    phone: '+254723456789',
    totalWeight: 298.2,
    totalValue: 1089.50,
    submissionCount: 38,
    rank: 2,
  },
  {
    id: '3',
    name: 'Peter Ochieng',
    phone: '+254734567890',
    totalWeight: 265.8,
    totalValue: 967.25,
    submissionCount: 35,
    rank: 3,
  },
  {
    id: '4',
    name: 'Sarah Muthoni',
    phone: '+254745678901',
    totalWeight: 234.1,
    totalValue: 852.80,
    submissionCount: 31,
    rank: 4,
  },
  {
    id: '5',
    name: 'James Kipchoge',
    phone: '+254756789012',
    totalWeight: 198.7,
    totalValue: 723.45,
    submissionCount: 26,
    rank: 5,
  },
]

const mockEnvironmentalImpact = [
  {
    label: 'CO₂ Saved',
    value: '2.4 tons',
    description: 'Equivalent to 5,200 km driven',
    icon: Leaf,
    color: 'text-emerald-600',
  },
  {
    label: 'Water Saved',
    value: '15,300 L',
    description: 'Enough for 100 showers',
    icon: Droplets,
    color: 'text-blue-600',
  },
  {
    label: 'Energy Saved',
    value: '4,800 kWh',
    description: 'Powers 5 homes for a month',
    icon: Zap,
    color: 'text-yellow-600',
  },
  {
    label: 'Trees Saved',
    value: '32',
    description: 'From paper recycling',
    icon: TreeDeciduous,
    color: 'text-green-600',
  },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const [revenueData, setRevenueData] = useState(generateRevenueData('month'))

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range)
    setRevenueData(generateRevenueData(range))
  }

  return (
    <Container>
      <div className="space-y-6 pb-20 lg:pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <PageHeader
            title="Analytics Dashboard"
            description="Insights and performance metrics"
          />
          <TimeRangeSelector
            selected={timeRange}
            onChange={handleTimeRangeChange}
          />
        </div>

        {/* Performance Metrics */}
        <PerformanceMetrics metrics={mockPerformanceMetrics} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RevenueChart data={revenueData} period={timeRange} />
          </div>

          {/* Material Breakdown - Takes 1 column */}
          <div>
            <MaterialBreakdown data={mockMaterialData} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Collectors */}
          <CollectorLeaderboard collectors={mockTopCollectors} />

          {/* Environmental Impact */}
          <EnvironmentalImpact metrics={mockEnvironmentalImpact} />
        </div>
      </div>
    </Container>
  )
}
