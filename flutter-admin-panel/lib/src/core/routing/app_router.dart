import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/dashboard/presentation/pages/dashboard_page.dart';
import '../../features/devices/presentation/pages/devices_page.dart';
import '../../features/devices/presentation/pages/device_details_page.dart';
import '../../features/policies/presentation/pages/policies_page.dart';
import '../../features/policies/presentation/pages/policy_details_page.dart';
import '../../features/apps/presentation/pages/apps_page.dart';
import '../../features/apps/presentation/pages/app_details_page.dart';
import '../../features/commands/presentation/pages/commands_page.dart';
import '../../features/monitoring/presentation/pages/monitoring_page.dart';
import '../../features/settings/presentation/pages/settings_page.dart';
import '../../shared/presentation/pages/error_page.dart';

import '../providers/auth_provider.dart';

// Router provider
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/login',
    debugLogDiagnostics: true,
    redirect: (context, state) {
      final isLoggedIn = authState.isLoggedIn;
      final isLoggingIn = state.fullPath == '/login';

      // If not logged in and not on login page, redirect to login
      if (!isLoggedIn && !isLoggingIn) {
        return '/login';
      }

      // If logged in and on login page, redirect to dashboard
      if (isLoggedIn && isLoggingIn) {
        return '/dashboard';
      }

      // No redirect needed
      return null;
    },
    routes: [
      // Auth Route
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),

      // Main App Routes
      ShellRoute(
        builder: (context, state, child) => MainLayout(child: child),
        routes: [
          // Dashboard
          GoRoute(
            path: '/dashboard',
            name: 'dashboard',
            builder: (context, state) => const DashboardPage(),
          ),

          // Devices
          GoRoute(
            path: '/devices',
            name: 'devices',
            builder: (context, state) => const DevicesPage(),
            routes: [
              GoRoute(
                path: 'device/:deviceId',
                name: 'device-details',
                builder: (context, state) {
                  final deviceId = state.pathParameters['deviceId']!;
                  return DeviceDetailsPage(deviceId: deviceId);
                },
              ),
            ],
          ),

          // Policies
          GoRoute(
            path: '/policies',
            name: 'policies',
            builder: (context, state) => const PoliciesPage(),
            routes: [
              GoRoute(
                path: 'policy/:policyId',
                name: 'policy-details',
                builder: (context, state) {
                  final policyId = state.pathParameters['policyId']!;
                  return PolicyDetailsPage(policyId: policyId);
                },
              ),
            ],
          ),

          // Apps
          GoRoute(
            path: '/apps',
            name: 'apps',
            builder: (context, state) => const AppsPage(),
            routes: [
              GoRoute(
                path: 'app/:appId',
                name: 'app-details',
                builder: (context, state) {
                  final appId = state.pathParameters['appId']!;
                  return AppDetailsPage(appId: appId);
                },
              ),
            ],
          ),

          // Commands
          GoRoute(
            path: '/commands',
            name: 'commands',
            builder: (context, state) => const CommandsPage(),
          ),

          // Monitoring
          GoRoute(
            path: '/monitoring',
            name: 'monitoring',
            builder: (context, state) => const MonitoringPage(),
          ),

          // Settings
          GoRoute(
            path: '/settings',
            name: 'settings',
            builder: (context, state) => const SettingsPage(),
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) => ErrorPage(
      error: state.error.toString(),
    ),
  );
});

// Main Layout Widget
class MainLayout extends StatelessWidget {
  final Widget child;

  const MainLayout({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          // Side Navigation
          const NavigationDrawer(),

          // Main Content
          Expanded(
            child: Column(
              children: [
                // App Bar
                const MainAppBar(),

                // Content
                Expanded(child: child),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// Navigation Drawer
class NavigationDrawer extends ConsumerWidget {
  const NavigationDrawer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      width: 250,
      color: Theme.of(context).colorScheme.surface,
      child: Column(
        children: [
          // Logo Header
          Container(
            height: 80,
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(
                  Icons.security,
                  size: 32,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 12),
                Text(
                  'MDM Admin',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
          ),

          const Divider(),

          // Navigation Items
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(8),
              children: const [
                _NavigationItem(
                  icon: Icons.dashboard,
                  label: 'Dashboard',
                  route: '/dashboard',
                ),
                _NavigationItem(
                  icon: Icons.devices,
                  label: 'Devices',
                  route: '/devices',
                ),
                _NavigationItem(
                  icon: Icons.policy,
                  label: 'Policies',
                  route: '/policies',
                ),
                _NavigationItem(
                  icon: Icons.apps,
                  label: 'Applications',
                  route: '/apps',
                ),
                _NavigationItem(
                  icon: Icons.terminal,
                  label: 'Commands',
                  route: '/commands',
                ),
                _NavigationItem(
                  icon: Icons.monitor,
                  label: 'Monitoring',
                  route: '/monitoring',
                ),
                Divider(),
                _NavigationItem(
                  icon: Icons.settings,
                  label: 'Settings',
                  route: '/settings',
                ),
              ],
            ),
          ),

          // User Profile Section
          Container(
            padding: const EdgeInsets.all(16),
            child: Consumer(
              builder: (context, ref, child) {
                final authState = ref.watch(authProvider);
                return Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      child: Text(
                        authState.user?.name != null &&
                                authState.user!.name.isNotEmpty
                            ? authState.user!.name.substring(0, 1).toUpperCase()
                            : 'U',
                        style: const TextStyle(color: Colors.white),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            authState.user?.name ?? 'User',
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith(
                                  fontWeight: FontWeight.w500,
                                ),
                          ),
                          Text(
                            authState.user?.email ?? '',
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: Theme.of(context)
                                          .colorScheme
                                          .onSurface
                                          .withOpacity(0.6),
                                    ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.logout),
                      onPressed: () => ref.read(authProvider.notifier).logout(),
                      tooltip: 'Logout',
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// Navigation Item Widget
class _NavigationItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String route;

  const _NavigationItem({
    required this.icon,
    required this.label,
    required this.route,
  });

  @override
  Widget build(BuildContext context) {
    final currentRoute = GoRouterState.of(context).fullPath;
    final isSelected = currentRoute?.startsWith(route) ?? false;

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 2),
      child: ListTile(
        leading: Icon(
          icon,
          color: isSelected
              ? Theme.of(context).colorScheme.primary
              : Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
        ),
        title: Text(
          label,
          style: TextStyle(
            color: isSelected
                ? Theme.of(context).colorScheme.primary
                : Theme.of(context).colorScheme.onSurface,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
        selected: isSelected,
        selectedTileColor:
            Theme.of(context).colorScheme.primary.withOpacity(0.1),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        onTap: () => context.go(route),
      ),
    );
  }
}

// Main App Bar
class MainAppBar extends ConsumerWidget {
  const MainAppBar({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      height: 80,
      padding: const EdgeInsets.symmetric(horizontal: 24),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        border: Border(
          bottom: BorderSide(
            color: Theme.of(context).colorScheme.outline.withOpacity(0.2),
          ),
        ),
      ),
      child: Row(
        children: [
          // Page Title
          Expanded(
            child: Text(
              _getPageTitle(context),
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
            ),
          ),

          // Action Buttons
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () => _showNotifications(context),
            tooltip: 'Notifications',
          ),

          const SizedBox(width: 8),

          IconButton(
            icon: Icon(
              Theme.of(context).brightness == Brightness.light
                  ? Icons.dark_mode
                  : Icons.light_mode,
            ),
            onPressed: () => _toggleTheme(ref),
            tooltip: 'Toggle Theme',
          ),
        ],
      ),
    );
  }

  String _getPageTitle(BuildContext context) {
    final route = GoRouterState.of(context).fullPath ?? '';

    if (route.startsWith('/dashboard')) return 'Dashboard';
    if (route.startsWith('/devices')) return 'Device Management';
    if (route.startsWith('/policies')) return 'Security Policies';
    if (route.startsWith('/apps')) return 'Application Management';
    if (route.startsWith('/commands')) return 'Command Center';
    if (route.startsWith('/monitoring')) return 'System Monitoring';
    if (route.startsWith('/settings')) return 'Settings';

    return 'MDM Admin Panel';
  }

  void _showNotifications(BuildContext context) {
    // TODO: Implement notifications
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Notifications feature coming soon!'),
      ),
    );
  }

  void _toggleTheme(WidgetRef ref) {
    // TODO: Implement theme toggle
    // ref.read(themeProvider.notifier).toggleTheme();
  }
}
