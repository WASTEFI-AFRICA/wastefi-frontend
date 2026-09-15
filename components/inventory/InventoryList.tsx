'use client'

import { useState } from 'react'
import { Search, Filter, SortAsc } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { InventoryCard } from './InventoryCard'

interface Material {
  id: string
  name: string
  type: string
  currentStock: number
  unit: string
  minThreshold: number
  maxCapacity: number
  lastUpdated: Date
  valuePerUnit: number
}

interface InventoryListProps {
  materials: Material[]
  onAdjust: (materialId: string) => void
}

type SortOption = 'name' | 'stock-asc' | 'stock-desc' | 'value-desc'

export function InventoryList({ materials, onAdjust }: InventoryListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('name')

  // Get unique material types
  const materialTypes = Array.from(new Set(materials.map(m => m.type)))

  // Filter materials
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || material.type === filterType
    return matchesSearch && matchesType
  })

  // Sort materials
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'stock-asc':
        return a.currentStock - b.currentStock
      case 'stock-desc':
        return b.currentStock - a.currentStock
      case 'value-desc':
        return (b.currentStock * b.valuePerUnit) - (a.currentStock * a.valuePerUnit)
      default:
        return 0
    }
  })

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filter */}
        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
          >
            <option value="all">All Types</option>
            {materialTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="relative sm:w-48">
          <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
          >
            <option value="name">Name (A-Z)</option>
            <option value="stock-asc">Stock (Low to High)</option>
            <option value="stock-desc">Stock (High to Low)</option>
            <option value="value-desc">Value (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {sortedMaterials.length} of {materials.length} materials
        </p>
      </div>

      {/* Materials Grid */}
      {sortedMaterials.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedMaterials.map((material) => (
            <InventoryCard
              key={material.id}
              material={material}
              onAdjust={onAdjust}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No materials found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
}
