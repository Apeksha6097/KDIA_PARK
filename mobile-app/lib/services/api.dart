import 'dart:convert';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // Use localhost for local development. For Android emulator, use 10.0.2.2.
  final String _baseUrl = 'http://127.0.0.1:5000'; // Target port 5000 of the main backend

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final url = Uri.parse('$_baseUrl/api/auth/login');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'loginId': email,
          'password': password,
        }),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        // Assuming the API returns a 'token' field in the JSON response
        if (data['token'] != null) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('jwt_token', data['token']);
          if (data['user'] != null && data['user']['fullName'] != null) {
            await prefs.setString('user_fullname', data['user']['fullName']);
          }
          return {
            'success': true,
            'message': 'Login successful',
          };
        } else {
          return {
            'success': false,
            'message': 'Invalid response from server: Token missing.',
          };
        }
      } else {
        // Handle error response (e.g. 401 Unauthorized)
        final data = jsonDecode(response.body);
        return {
          'success': false,
          'message': data['error'] ?? data['message'] ?? 'Invalid credentials or server error',
        };
      }
    } on TimeoutException {
      return {
        'success': false,
        'message': 'Connection timeout. The server took too long to respond.',
      };
    } catch (e) {
      String errorMessage = 'Failed to connect to the server.';
      final errorStr = e.toString();
      
      if (errorStr.contains('ClientException') || errorStr.contains('XMLHttpRequest error')) {
        errorMessage = 'Network error or CORS issue. Check if server is running and allows origins.';
      } else if (errorStr.contains('SocketException')) {
        errorMessage = 'Server is not running or wrong URL.';
      } else {
        errorMessage = 'Unexpected error: $errorStr';
      }
      
      return {
        'success': false,
        'message': errorMessage,
      };
    }
  }

  Future<String?> getUserFullName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_fullname');
  }

  Future<Map<String, dynamic>> getDashboard() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('jwt_token');
      if (token == null) {
        return {
          'success': false,
          'message': 'Session expired. Please log in again.',
        };
      }

      final url = Uri.parse('$_baseUrl/api/dashboard/summary');
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'data': data,
        };
      } else if (response.statusCode == 401) {
        return {
          'success': false,
          'message': 'Session expired. Please log in again.',
          'isAuthError': true,
        };
      } else {
        final data = jsonDecode(response.body);
        return {
          'success': false,
          'message': data['error'] ?? data['message'] ?? 'Failed to fetch dashboard data.',
        };
      }
    } on TimeoutException {
      return {
        'success': false,
        'message': 'Connection timeout. The server took too long to respond.',
      };
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }
}
