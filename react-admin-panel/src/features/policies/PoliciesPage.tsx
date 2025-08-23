import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Shield, Edit, Trash2, Users, Copy } from 'lucide-react';
import { apiClient } from '../../services/api';

interface Policy {
  id: string;
  name: string;
  description: string;
  type: 'security' | 'app' | 'device' | 'compliance';
  status: 'active' | 'inactive' | 'draft';
  deviceCount: number;
  createdAt: string;
  updatedAt: string;
}

async function fetchPolicies(): Promise<Policy[]> {
  return await apiClient.get<Policy[]>('/policies');
}

function PolicyTypeBadge({ type }: { type: Policy['type'] }) {
  const styles = {
    security: 'bg-red-100 text-red-800',
    app: 'bg-blue-100 text-blue-800',
    device: 'bg-green-100 text-green-800',
    compliance: 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

function PolicyStatusBadge({ status }: { status: Policy['status'] }) {
  const styles = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    draft: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function PoliciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<Policy['type'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Policy['status'] | 'all'>('all');

  const {
    data: policies = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['policies'],
    queryFn: fetchPolicies,
  });

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || policy.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || policy.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading policies...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-red-800">Error loading policies</h3>
          <p className="text-sm text-red-700 mt-1">
            {error instanceof Error ? error.message : 'Failed to load policies'}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Policies</h1>
            <p className="mt-1 text-sm text-gray-600">
              Create and manage device policies
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Policy
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search policies..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as Policy['type'] | 'all')}
          >
            <option value="all">All Types</option>
            <option value="security">Security</option>
            <option value="app">App</option>
            <option value="device">Device</option>
            <option value="compliance">Compliance</option>
          </select>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Policy['status'] | 'all')}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPolicies.length === 0 ? (
          <div className="col-span-full">
            <div className="text-center py-12">
              <Shield className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No policies found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters.' 
                  : 'Get started by creating your first policy.'}
              </p>
              <div className="mt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center mx-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Policy
                </button>
              </div>
            </div>
          </div>
        ) : (
          filteredPolicies.map((policy) => (
            <div key={policy.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Shield className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{policy.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <PolicyTypeBadge type={policy.type} />
                        <PolicyStatusBadge status={policy.status} />
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {policy.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{policy.deviceCount} devices</span>
                  </div>
                  <span>Updated {new Date(policy.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="mt-4 flex justify-end">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredPolicies.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          Showing {filteredPolicies.length} of {policies.length} policies
        </div>
      )}
    </div>
  );
}
