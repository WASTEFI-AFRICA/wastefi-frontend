'use client'

import { Wallet, Smartphone, Building2, Coins } from 'lucide-react'

export type PaymentMethod = 'mobile_money' | 'stellar' | 'bank_transfer' | 'cash'

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null
  onSelectMethod: (method: PaymentMethod) => void
}

const PAYMENT_METHODS = [
  {
    id: 'mobile_money' as PaymentMethod,
    name: 'Mobile Money',
    description: 'M-Pesa, Airtel Money, etc.',
    icon: Smartphone,
    color: 'emerald',
  },
  {
    id: 'stellar' as PaymentMethod,
    name: 'Stellar Wallet',
    description: 'Direct to Stellar account',
    icon: Wallet,
    color: 'blue',
  },
  {
    id: 'bank_transfer' as PaymentMethod,
    name: 'Bank Transfer',
    description: 'Direct bank deposit',
    icon: Building2,
    color: 'purple',
  },
  {
    id: 'cash' as PaymentMethod,
    name: 'Cash Payment',
    description: 'Pay in cash on-site',
    icon: Coins,
    color: 'orange',
  },
]

export function PaymentMethodSelector({
  selectedMethod,
  onSelectMethod,
}: PaymentMethodSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Payment Method *
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon
          const isSelected = selectedMethod === method.id
          
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelectMethod(method.id)}
              className={`p-4 rounded-lg border-2 flex items-start gap-3 text-left transition-all ${
                isSelected
                  ? `border-${method.color}-500 bg-${method.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isSelected
                    ? `bg-${method.color}-100`
                    : 'bg-gray-100'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isSelected
                      ? `text-${method.color}-600`
                      : 'text-gray-400'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold mb-0.5 ${
                    isSelected
                      ? `text-${method.color}-900`
                      : 'text-gray-900'
                  }`}
                >
                  {method.name}
                </h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
