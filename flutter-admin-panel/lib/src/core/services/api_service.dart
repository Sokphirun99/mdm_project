import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

class ApiService {
  static const String _baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3000',
  );

  static const Duration _timeout = Duration(seconds: 30);

  Uri _buildUri(String endpoint, {Map<String, String>? queryParams}) {
    final base = Uri.parse(_baseUrl);
    // Ensure we resolve correctly whether endpoint starts with '/'
    final clean = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    final uri = base.resolve(clean);
    return queryParams != null
        ? uri.replace(queryParameters: queryParams)
        : uri;
  }

  // Headers for all requests
  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

  // Headers with authentication
  Map<String, String> _authHeaders(String? token) => {
        ..._headers,
        if (token != null) 'Authorization': 'Bearer $token',
      };

  // GET request
  Future<Map<String, dynamic>> get(
    String endpoint, {
    String? token,
    Map<String, String>? queryParams,
  }) async {
    try {
      final uri = _buildUri(endpoint, queryParams: queryParams);

      assert(() {
        debugPrint('[ApiService] GET  $uri');
        return true;
      }());

      final response =
          await http.get(uri, headers: _authHeaders(token)).timeout(_timeout);

      return _handleResponse(response);
    } catch (e) {
      throw ApiException('Network error: $e, uri=$endpoint');
    }
  }

  // POST request
  Future<Map<String, dynamic>> post(
    String endpoint, {
    String? token,
    Map<String, dynamic>? body,
  }) async {
    try {
      final uri = _buildUri(endpoint);

      assert(() {
        debugPrint('[ApiService] POST $uri');
        return true;
      }());
      final response = await http
          .post(
            uri,
            headers: _authHeaders(token),
            body: body != null ? jsonEncode(body) : null,
          )
          .timeout(_timeout);

      return _handleResponse(response);
    } catch (e) {
      final uri = _buildUri(endpoint);
      throw ApiException('Network error: $e, uri=$uri');
    }
  }

  // PUT request
  Future<Map<String, dynamic>> put(
    String endpoint, {
    String? token,
    Map<String, dynamic>? body,
  }) async {
    try {
      final uri = _buildUri(endpoint);

      assert(() {
        debugPrint('[ApiService] PUT  $uri');
        return true;
      }());
      final response = await http
          .put(
            uri,
            headers: _authHeaders(token),
            body: body != null ? jsonEncode(body) : null,
          )
          .timeout(_timeout);

      return _handleResponse(response);
    } catch (e) {
      final uri = _buildUri(endpoint);
      throw ApiException('Network error: $e, uri=$uri');
    }
  }

  // DELETE request
  Future<Map<String, dynamic>> delete(
    String endpoint, {
    String? token,
  }) async {
    try {
      final uri = _buildUri(endpoint);

      assert(() {
        debugPrint('[ApiService] DELETE $uri');
        return true;
      }());
      final response = await http
          .delete(uri, headers: _authHeaders(token))
          .timeout(_timeout);

      return _handleResponse(response);
    } catch (e) {
      final uri = _buildUri(endpoint);
      throw ApiException('Network error: $e, uri=$uri');
    }
  }

  // Health check
  Future<bool> checkHealth() async {
    try {
      final response = await get('/health');
      final status = (response['status'] as String?)?.toLowerCase();
      return status == 'ok';
    } catch (e) {
      return false;
    }
  }

  // Handle HTTP response
  Map<String, dynamic> _handleResponse(http.Response response) {
    final statusCode = response.statusCode;

    try {
      final Map<String, dynamic> data = jsonDecode(response.body);

      if (statusCode >= 200 && statusCode < 300) {
        return data;
      } else {
        final message = data['message'] ?? 'Unknown error';
        throw ApiException('API Error ($statusCode): $message', statusCode);
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      final ct = response.headers['content-type'] ?? 'unknown';
      final snippet = response.body.length > 160
          ? '${response.body.substring(0, 160)}…'
          : response.body;
      throw ApiException(
          'Failed to parse response (status=$statusCode, content-type=$ct): ${snippet.isEmpty ? '<empty>' : snippet}',
          statusCode);
    }
  }
}

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  const ApiException(this.message, [this.statusCode]);

  @override
  String toString() => 'ApiException: $message';
}
