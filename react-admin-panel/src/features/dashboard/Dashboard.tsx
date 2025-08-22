import { useQuery } from '@tanstack/react-query';
import { Users, Wifi, WifiOff, Clock, Shield, Loader2 } from 'lucide-react';
import { apiClient } from '../../services/api';

interface DashboardStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  pendingCommands: number;
  activePolicies: number;
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
  if (response.success && response.data) {
    return response.data;
  }
  throw new Error('Failed to fetch dashboard stats');
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 ${color} rounded-md flex items-center justify-center`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
              <p className="text-sm text-red-700 mt-1">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your mobile device management system
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Total Devices"
          value={stats?.totalDevices || 0}
          icon={<Users className="h-5 w-5 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Online Devices"
          value={stats?.onlineDevices || 0}
          icon={<Wifi className="h-5 w-5 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Offline Devices"
          value={stats?.offlineDevices || 0}
          icon={<WifiOff className="h-5 w-5 text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Pending Commands"
          value={stats?.pendingCommands || 0}
          icon={<Clock className="h-5 w-5 text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Active Policies"
          value={stats?.activePolicies || 0}
          icon={<Shield className="h-5 w-5 text-white" />}
          color="bg-indigo-500"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-500 text-center">
              Recent activity feed will be implemented here...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
