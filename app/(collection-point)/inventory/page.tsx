'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Container } from '@/components/layout/Container'
import {
  MaterialStats,
  InventoryList,
  StockAdjustmentModal,
  LowStockAlert,
} from '@/components/inventory'

// Mock data - in production, this would come from your API
const mockInventory = [
  {
    id: '1',
    name: 'PET Plastic Bottles',
    type: 'Plastic',
    currentStock: 45.5,
    unit: 'kg',
    minThreshold: 50,
    maxCapacity: 500,
    lastUpdated: new Date('2024-02-10'),
    valuePerUnit: 0.85,
  },
  {
    id: '2',
    name: 'Aluminum Cans',
    type: 'Metal',
    currentStock: 120.3,
    unit: 'kg',
    minThreshold: 30,
    maxCapacity: 300,
    lastUpdated: new Date('2024-02-14'),
    valuePerUnit: 1.2,
  },
  {
    id: '3',
    name: 'Cardboard',
    type: 'Paper',
    currentStock: 285.7,
    unit: 'kg',
    minThreshold: 100,
    maxCapacity: 1000,
    lastUpdated: new Date('2024-02-13'),
    valuePerUnit: 0.45,
  },
  {
    id: '4',
    name: 'Glass Bottles',
    type: 'Glass',
    currentStock: 15.2,
    unit: 'kg',
    minThreshold: 20,
    maxCapacity: 200,
    lastUpdated: new Date('2024-02-09'),
    valuePerUnit: 0.35,
  },
  {
    id: '5',
    name: 'Steel Scrap',
    type: 'Metal',
    currentStock: 78.9,
    unit: 'kg',
    minThreshold: 40,
    maxCapacity: 400,
    lastUpdated: new Date('2024-02-12'),
    valuePerUnit: 0.95,
  },
  {
    id: '6',
    name: 'Office Paper',
    type: 'Paper',
    currentStock: 156.4,
    unit: 'kg',
    minThreshold: 80,
    maxCapacity: 600,
    lastUpdated: new Date('2024-02-14'),
    valuePerUnit: 0.55,
  },
  {
    id: '7',
    name: 'HDPE Plastic',
    type: 'Plastic',
    currentStock: 92.1,
    unit: 'kg',
    minThreshold: 60,
    maxCapacity: 400,
    lastUpdated: new Date('2024-02-11'),
    valuePerUnit: 0.75,
  },
  {
    id: '8',
    name: 'Copper Wire',
    type: 'Metal',
    currentStock: 8.5,
    unit: 'kg',
    minThreshold: 10,
    maxCapacity: 100,
    lastUpdated: new Date('2024-02-08'),
    valuePerUnit: 8.5,
  },
]

export default function InventoryPage() {
  const [inventory, setInventory] = useState(mockInventory)
  const [selectedMaterial, setSelectedMaterial] = useState<typeof mockInventory[0] | null>(null)
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false)
  const [showLowStockAlert, setShowLowStockAlert] = useState(true)

  // Calculate statistics
  const stats = {
    totalMaterials: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.valuePerUnit), 0),
    lowStockCount: inventory.filter(item => item.currentStock <= item.minThreshold).length,
    totalWeight: inventory.reduce((sum, item) => sum + item.currentStock, 0),
  }

  // Get low stock materials
  const lowStockMaterials = inventory.filter(item => item.currentStock <= item.minThreshold)

  const handleAdjust = (materialId: string) => {
    const material = inventory.find(m => m.id === materialId)
    if (material) {
      setSelectedMaterial(material)
      setShowAdjustmentModal(true)
    }
  }

  const handleConfirmAdjustment = (
    materialId: string,
    adjustment: number,
    reason: string,
    notes: string
  ) => {
    setInventory(prev => prev.map(item => {
      if (item.id === materialId) {
        return {
          ...item,
          currentStock: item.currentStock + adjustment,
          lastUpdated: new Date(),
        }
      }
      return item
    }))

    // In production, send to API
    console.log('Stock adjustment:', { materialId, adjustment, reason, notes })
  }

  const handleViewLowStockDetails = (materialId: string) => {
    setShowLowStockAlert(false)
    handleAdjust(materialId)
  }

  return (
    <Container>
      <div className="space-y-6 pb-20 lg:pb-6">
        {/* Header */}
        <PageHeader
          title="Inventory Management"
          description="Track and manage material stock levels"
        />

        {/* Statistics */}
        <MaterialStats stats={stats} />

        {/* Low Stock Alert */}
        {showLowStockAlert && lowStockMaterials.length > 0 && (
          <LowStockAlert
            materials={lowStockMaterials}
            onViewDetails={handleViewLowStockDetails}
            onDismiss={() => setShowLowStockAlert(false)}
          />
        )}

        {/* Inventory List */}
        <InventoryList
          materials={inventory}
          onAdjust={handleAdjust}
        />
      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={showAdjustmentModal}
        onClose={() => {
          setShowAdjustmentModal(false)
          setSelectedMaterial(null)
        }}
        material={selectedMaterial}
        onConfirm={handleConfirmAdjustment}
      />
    </Container>
  )
}
