import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';

// User Model
class User {
  final String id;
  final String email;
  final String name;
  final String role;
  final DateTime? lastLogin;

  const User({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    this.lastLogin,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    // Be flexible with backend key names and nulls
    final String id = (json['id'] ?? '').toString();
    final String email = (json['email'] ?? '').toString();
    final String role = (json['role'] ?? '').toString();

    // Prefer explicit "name"; otherwise build from firstName/lastName; fallback to email
    String? name = (json['name'] as String?)?.trim();
    final String? firstName = (json['firstName'] as String?)?.trim();
    final String? lastName = (json['lastName'] as String?)?.trim();
    if (name == null || name.isEmpty) {
      final combined = [firstName, lastName]
          .where((p) => p != null && p.isNotEmpty)
          .join(' ')
          .trim();
      name = combined.isNotEmpty ? combined : email;
    }

    // Support multiple timestamp keys
    final dynamic ts =
        json['lastLogin'] ?? json['last_login'] ?? json['last_login_at'];
    DateTime? lastLogin;
    if (ts is String && ts.isNotEmpty) {
      lastLogin = DateTime.tryParse(ts);
    }

    return User(
      id: id,
      email: email,
      name: name,
      role: role,
      lastLogin: lastLogin,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'role': role,
      // Keep snake_case for backward compatibility with backend
      'last_login': lastLogin?.toIso8601String(),
    };
  }
}

// Auth State
class AuthState {
  final User? user;
  final bool isLoading;
  final String? error;
  final String? token;

  const AuthState({
    this.user,
    this.isLoading = false,
    this.error,
    this.token,
  });

  bool get isLoggedIn => user != null && token != null;

  AuthState copyWith({
    User? user,
    bool? isLoading,
    String? error,
    String? token,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      token: token ?? this.token,
    );
  }
}

// Auth Notifier
class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const AuthState());

  final _apiService = ApiService();

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      // Call the backend API
      final response = await _apiService.post('/api/auth/login', body: {
        'email': email,
        'password': password,
      });

      // Validate response shape defensively
      final dynamic rawUser = response['user'];
      final dynamic rawToken = response['token'];

      assert(() {
        // Lightweight debug info to help diagnose shape mismatches
        // ignore: avoid_print
        print('[Auth] login response keys: ${response.keys.toList()}');
        // ignore: avoid_print
        print(
            '[Auth] user type: ${rawUser?.runtimeType}, token type: ${rawToken?.runtimeType}');
        return true;
      }());

      if (rawUser is! Map<String, dynamic>) {
        throw const ApiException(
            'Malformed response: user is missing or not an object');
      }
      if (rawToken is! String || rawToken.isEmpty) {
        throw const ApiException(
            'Malformed response: token is missing or not a string');
      }

      final user = User.fromJson(rawUser);
      final token = rawToken;

      state = state.copyWith(
        user: user,
        token: token,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> logout() async {
    try {
      // Optionally call logout API endpoint
      if (state.token != null) {
        await _apiService.post('/api/auth/logout', token: state.token);
      }
    } catch (e) {
      // Log error but don't block logout
      print('Logout API error: $e');
    } finally {
      state = const AuthState();
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}

// Auth Provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
