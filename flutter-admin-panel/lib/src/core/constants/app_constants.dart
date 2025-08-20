class AppConstants {
  static const String appName = 'MDM Admin Panel';
  static const String appVersion = '1.0.0';

  // API Configuration
  static const String baseUrl = 'http://localhost:3000/api';
  static const Duration apiTimeout = Duration(seconds: 30);

  // Storage Keys
  static const String authTokenKey = 'auth_token';
  static const String userDataKey = 'user_data';
  static const String themeKey = 'theme_preference';

  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;

  // UI Constants
  static const double defaultPadding = 16.0;
  static const double smallPadding = 8.0;
  static const double largePadding = 24.0;

  static const double defaultBorderRadius = 8.0;
  static const double cardBorderRadius = 12.0;

  // Animation Durations
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 300);
  static const Duration longAnimation = Duration(milliseconds: 500);

  // Breakpoints
  static const double mobileBreakpoint = 600;
  static const double tabletBreakpoint = 900;
  static const double desktopBreakpoint = 1200;

  // Device Status Colors
  static const String enrolledColor = '#4CAF50';
  static const String pendingColor = '#FF9800';
  static const String inactiveColor = '#9E9E9E';
  static const String compromisedColor = '#F44336';

  // Command Types
  static const List<String> deviceCommands = [
    'lock_device',
    'unlock_device',
    'wipe_device',
    'reboot_device',
    'get_device_info',
  ];

  static const List<String> appCommands = [
    'install_app',
    'uninstall_app',
  ];

  static const List<String> securityCommands = [
    'disable_camera',
    'enable_camera',
    'disable_usb',
    'enable_usb',
  ];

  // Date Formats
  static const String dateFormat = 'MMM dd, yyyy';
  static const String timeFormat = 'HH:mm';
  static const String dateTimeFormat = 'MMM dd, yyyy HH:mm';
  static const String isoDateFormat = 'yyyy-MM-ddTHH:mm:ss.SSSZ';
}
