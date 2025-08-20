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
    return User(
      id: json['id'],
      email: json['email'],
      name: json['name'],
      role: json['role'],
      lastLogin: json['last_login'] != null
          ? DateTime.parse(json['last_login'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'role': role,
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

      final user = User.fromJson(response['user']);
      final token = response['token'];

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
