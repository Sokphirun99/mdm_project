import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';

type DashboardStats = {
	users: { total: number; active: number };
	devices: { total: number; active: number; inactive: number };
	organizations: { total: number };
	policies: { total: number };
	apps: { total: number };
	commands: { recent: number };
	lastUpdated: string;
};

async function fetchDashboardStats(): Promise<DashboardStats> {
	// Backend returns the stats object directly (no { success, data } wrapper)
	return apiClient.get<DashboardStats>('/dashboard/stats');
}

function StatCard({ title, value, subtext }: { title: string; value: number | string; subtext?: string }) {
	return (
		<div className="bg-white overflow-hidden shadow rounded-lg">
			<div className="p-5">
				<div className="flex items-center">
					<div className="ml-0 w-0 flex-1">
						<dl>
							<dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
							<dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
							{subtext ? <dd className="mt-1 text-xs text-gray-500">{subtext}</dd> : null}
						</dl>
					</div>
				</div>
			</div>
		</div>
	);
}

export function Dashboard() {
	const { data, isLoading, error } = useQuery({
		queryKey: ['dashboard-stats'],
		queryFn: fetchDashboardStats,
		refetchInterval: 30_000,
		staleTime: 30_000,
	});

	if (isLoading) {
		return (
			<div className="p-6 flex items-center justify-center min-h-96">
				<div className="text-gray-600">Loading dashboard...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6">
				<div className="bg-red-50 border border-red-200 rounded-md p-4">
					<div className="text-sm font-medium text-red-800">Error loading dashboard</div>
					<div className="text-sm text-red-700 mt-1">{error instanceof Error ? error.message : 'Unknown error'}</div>
				</div>
			</div>
		);
	}

	const stats = data!;

	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
				<p className="mt-1 text-sm text-gray-600">Overview of your mobile device management system</p>
			</div>

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				<StatCard title="Users" value={stats.users.total} subtext={`Active: ${stats.users.active}`} />
				<StatCard title="Devices" value={stats.devices.total} subtext={`Active: ${stats.devices.active} • Inactive: ${stats.devices.inactive}`} />
				<StatCard title="Organizations" value={stats.organizations.total} />
				<StatCard title="Policies" value={stats.policies.total} />
				<StatCard title="Apps" value={stats.apps.total} />
			</div>

			<div className="mt-6 text-xs text-gray-500">Last updated: {new Date(stats.lastUpdated).toLocaleString()}</div>
		</div>
	);
}
