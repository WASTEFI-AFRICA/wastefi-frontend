import { Server, Database, Activity, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/layout/Container';
import { SystemOverview, UserStats, RecentActivity, PlatformMetrics } from '@/components/admin';

// Mock data
const mockSystemMetrics = [
  {
    label: 'API Server',
    value: '99.9% Uptime',
    status: 'healthy' as const,
    description: 'All endpoints responding normally',
    icon: Server,
  },
  {
    label: 'Database',
    value: '45% Usage',
    status: 'healthy' as const,
    description: '2.4 TB of 5.3 TB used',
    icon: Database,
  },
  {
    label: 'Response Time',
    value: '124ms',
    status: 'healthy' as const,
    description: 'Average API response time',
    icon: Activity,
  },
  {
    label: 'Error Rate',
    value: '0.02%',
    status: 'healthy' as const,
    description: '12 errors in last 24 hours',
    icon: AlertCircle,
  },
];

const mockUserStats = {
  totalUsers: 5847,
  activeCollectors: 2341,
  collectionPoints: 87,
  adminUsers:
