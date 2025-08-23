import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './store/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginForm } from './features/auth/LoginForm';
import { Dashboard } from './features/dashboard/Dashboard';
import { DevicesPage } from './features/devices/DevicesPage';
import { PoliciesPage } from './features/policies/PoliciesPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Placeholder components for other routes
function AppsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Apps</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Apps page - Coming soon...</p>
      </div>
    </div>
  );
}

function CommandsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Commands</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Commands page - Coming soon...</p>
      </div>
    </div>
  );
}

function MonitoringPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Monitoring</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Monitoring page - Coming soon...</p>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Settings page - Coming soon...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="devices" element={<DevicesPage />} />
                <Route path="policies" element={<PoliciesPage />} />
                <Route path="apps" element={<AppsPage />} />
                <Route path="commands" element={<CommandsPage />} />
                <Route path="monitoring" element={<MonitoringPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;
