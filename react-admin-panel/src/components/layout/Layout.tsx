import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Menu as MenuIcon,
  BarChart3,
  Smartphone,
  Shield,
  Package,
  Send,
  Monitor,
  Settings,
  User,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

interface NavigationItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { text: 'Dashboard', icon: <BarChart3 className="h-5 w-5" />, path: '/dashboard' },
  { text: 'Devices', icon: <Smartphone className="h-5 w-5" />, path: '/devices' },
  { text: 'Policies', icon: <Shield className="h-5 w-5" />, path: '/policies' },
  { text: 'Apps', icon: <Package className="h-5 w-5" />, path: '/apps' },
  { text: 'Commands', icon: <Send className="h-5 w-5" />, path: '/commands' },
  { text: 'Reports', icon: <Monitor className="h-5 w-5" />, path: '/reports' },
  { text: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
];

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="flex items-center h-16 px-6 bg-primary-600 text-white">
        <h1 className="text-xl font-bold">MDM Admin</h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            className="w-full flex items-center px-4 py-3 text-left text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <span className="mr-3">{item.icon}</span>
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white shadow-lg`}>
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleDrawerToggle} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="flex justify-end p-4">
              <button
                onClick={handleDrawerToggle}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={handleDrawerToggle}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
              <h2 className="ml-4 text-xl font-semibold text-gray-900 lg:ml-0">
                Mobile Device Management
              </h2>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
