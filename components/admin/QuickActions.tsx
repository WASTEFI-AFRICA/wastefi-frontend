'use client'

import { 
  UserPlus, 
  FileText, 
  Settings, 
  Download,
  Bell,
  Shield 
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface QuickAction {
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  variant?: 'default' | 'primary'
}

interface QuickActionsProps {
  actions?: QuickAction[]
}

export function QuickActions({ actions }: QuickActionsProps) {
  const defaultActions: QuickAction[] = [
    {
      label: 'Add User',
      description: 'Create new user account',
      icon: UserPlus,
      onClick: () => console.log('Add user'),
      variant: 'primary',
    },
    {
      label: 'Generate Report',
      description: 'Export system data',
      icon: FileText,
      onClick: () => console.log('Generate report'),
    },
    {
      label: 'System Settings',
      description: 'Configure platform',
      icon: Settings,
      onClick: () => console.log('System settings'),
    },
    {
      label: 'Download Logs',
      description: 'Export activity logs',
      icon: Download,
      onClick: () => console.log('Download logs'),
    },
    {
      label: 'Send Notification',
      description: 'Broadcast message',
      icon: Bell,
      onClick: () => console.log('Send notification'),
    },
    {
      label: 'Security Audit',
      description: 'Run security check',
      icon: Shield,
      onClick: () => console.log('Security audit'),
    },
  ]

  const displayActions = actions || defaultActions

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick Actions</h3>
        <p className="text-sm text-gray-600">Common administrative tasks</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayActions.map((action, index) => {
          const Icon = action.icon
          return (
            <button
              key={index}
              onClick={action.onClick}
              className="p-4 rounded-lg border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-0.5 text-sm">
                    {action.label}
                  </h4>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
