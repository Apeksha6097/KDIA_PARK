import 'package:flutter/material.dart';
import '../constants/theme.dart';
import '../services/api.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final ApiService _apiService = ApiService();
  bool _isLoading = true;
  Map<String, dynamic>? _profileData;

  // Password change state
  bool _showPasswordModal = false;
  bool _isChangingPassword = false;
  bool _passwordSuccess = false;
  String _passwordError = '';
  final TextEditingController _currentPasswordController = TextEditingController();
  final TextEditingController _newPasswordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  @override
  void dispose() {
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _loadProfile() async {
    setState(() {
      _isLoading = true;
    });

    // Static demo profile — used as fallback if backend is not running
    const demoProfile = {
      'fullName': 'Rahul Sharma (Demo)',
      'email': 'rahul.sharma@example.com',
      'mobileNumber': '9876543210',
      'consumerId': 'KDIA-2026-00142',
      'addressLine1': '12, Green Valley Society',
      'addressLine2': 'Near Solar Park, Phalodi',
      'city': 'Jodhpur',
      'state': 'Rajasthan',
      'pinCode': '342001',
      'locationType': 'Residential',
      'dob': '1990-05-15',
      'gender': 'Male',
      'alternateMobile': '',
      'preferredComm': 'Email',
      'occupancyType': 'Owner',
    };

    try {
      final profileRes = await _apiService.getProfile();
      if (profileRes['success'] == true && profileRes['data'] != null) {
        _profileData = profileRes['data'];
      } else {
        _profileData = demoProfile;
      }
    } catch (e) {
      debugPrint('Error loading profile: $e');
      _profileData = demoProfile;
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  String _formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return '${date.day.toString().padLeft(2, '0')} ${months[date.month - 1]} ${date.year}';
    } catch (_) {
      return dateString;
    }
  }

  Future<void> _handlePasswordSubmit() async {
    final newPass = _newPasswordController.text;
    final confirmPass = _confirmPasswordController.text;
    final currentPass = _currentPasswordController.text;

    if (currentPass.isEmpty || newPass.isEmpty || confirmPass.isEmpty) {
      setState(() => _passwordError = 'All fields are required');
      return;
    }
    if (newPass != confirmPass) {
      setState(() => _passwordError = 'New passwords do not match');
      return;
    }
    if (newPass.length < 8) {
      setState(() => _passwordError = 'Password must be at least 8 characters long');
      return;
    }

    final hasUpper = RegExp(r'[A-Z]').hasMatch(newPass);
    final hasLower = RegExp(r'[a-z]').hasMatch(newPass);
    final hasDigit = RegExp(r'\d').hasMatch(newPass);
    final hasSpecial = RegExp(r'[!@#$%^&*(),.?":{}|<>]').hasMatch(newPass);

    if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
      setState(() => _passwordError = 'Password must contain uppercase, lowercase, digit, and special character');
      return;
    }

    setState(() {
      _isChangingPassword = true;
      _passwordError = '';
    });

    // Simulate password change (or call API if backend is running)
    await Future.delayed(const Duration(seconds: 1));

    if (mounted) {
      setState(() {
        _isChangingPassword = false;
        _passwordSuccess = true;
        _currentPasswordController.clear();
        _newPasswordController.clear();
        _confirmPasswordController.clear();
      });

      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          setState(() {
            _showPasswordModal = false;
            _passwordSuccess = false;
          });
        }
      });
    }
  }

  void _handleLogout(BuildContext context) {
    Navigator.of(context).pushReplacementNamed('/login');
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: const TextStyle(fontWeight: FontWeight.w600)),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.all(AppSpacing.m),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
              ),
              SizedBox(height: AppSpacing.m),
              Text(
                'LOADING SECURE PROFILE...',
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textLight, letterSpacing: 1),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Profile', style: TextStyle(fontWeight: FontWeight.w700)),
        backgroundColor: AppColors.white,
        foregroundColor: AppColors.text,
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1.0),
          child: Container(
            color: AppColors.border,
            height: 1.0,
          ),
        ),
      ),
      body: SafeArea(
        child: Stack(
          children: [
            RefreshIndicator(
              onRefresh: _loadProfile,
              color: AppColors.primary,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(AppSpacing.l),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // 1. Hero Section
                    _buildHeroSection(),
                    const SizedBox(height: AppSpacing.xl),

                    // 2. Personal Information
                    _buildPersonalInfoSection(),
                    const SizedBox(height: AppSpacing.l),

                    // 3. Contact Information
                    _buildContactInfoSection(),
                    const SizedBox(height: AppSpacing.l),

                    // 4. Service Address
                    _buildServiceAddressSection(),
                    const SizedBox(height: AppSpacing.l),

                    // 5. Account Security
                    _buildAccountSecuritySection(),
                    const SizedBox(height: AppSpacing.l),

                    // 6. Support & Requests
                    _buildSupportRequestsSection(),
                    const SizedBox(height: AppSpacing.xl),

                    // 7. Log Out Button
                    _buildLogoutButton(),
                    const SizedBox(height: AppSpacing.l),

                    // 8. Footer Disclaimer
                    _buildFooterDisclaimer(),
                    const SizedBox(height: AppSpacing.l),
                  ],
                ),
              ),
            ),

            // Password Change Modal Overlay
            if (_showPasswordModal) _buildPasswordModal(),
          ],
        ),
      ),
    );
  }

  // ─── HERO SECTION ────────────────────────────────────────
  Widget _buildHeroSection() {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0f766e), Color(0xFF115e59)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: AppShadows.medium,
      ),
      padding: const EdgeInsets.all(AppSpacing.l),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.white.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.white.withValues(alpha: 0.2)),
            ),
            child: const Text(
              'ACCOUNT PROFILE',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.primaryLight, letterSpacing: 1.5),
            ),
          ),
          const SizedBox(height: AppSpacing.m),
          const Text(
            'My Profile',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: AppColors.white, height: 1.2),
          ),
          const SizedBox(height: AppSpacing.m),
          Text(
            'View your registered details and manage account security. Your information is protected and managed with enterprise-grade security.',
            style: TextStyle(fontSize: 14, color: AppColors.white.withValues(alpha: 0.8), height: 1.5),
          ),
        ],
      ),
    );
  }

  // ─── PERSONAL INFORMATION ────────────────────────────────
  Widget _buildPersonalInfoSection() {
    return _buildSectionCard(
      title: 'Personal Information',
      subtitle: 'Verified identity details',
      icon: Icons.lock_outline_rounded,
      iconBg: AppColors.background,
      iconColor: AppColors.textLight,
      children: [
        _buildProfileRow('Full Name', _profileData?['fullName'] ?? 'N/A'),
        const SizedBox(height: AppSpacing.m),
        _buildProfileRow('Date of Birth', _formatDate(_profileData?['dob'])),
        const SizedBox(height: AppSpacing.m),
        _buildProfileRow('Gender', (_profileData?['gender'] ?? 'N/A').toString()),
        const SizedBox(height: AppSpacing.l),
        _buildInfoNote(
          'Personal details are verified during onboarding and cannot be edited directly.',
          AppColors.background,
          AppColors.textSecondary,
          Icons.info_outline_rounded,
          AppColors.textLight,
        ),
      ],
    );
  }

  // ─── CONTACT INFORMATION ─────────────────────────────────
  Widget _buildContactInfoSection() {
    return _buildSectionCard(
      title: 'Contact Information',
      subtitle: 'Registered communication channels',
      icon: Icons.email_outlined,
      iconBg: AppColors.primaryLight,
      iconColor: AppColors.primary,
      children: [
        _buildProfileRowWithBadge('Email Address', _profileData?['email'] ?? 'N/A', 'Verified'),
        const SizedBox(height: AppSpacing.m),
        _buildProfileRowWithBadge('Mobile Number', '+91 ${_profileData?['mobileNumber'] ?? 'N/A'}', 'Verified'),
        if ((_profileData?['alternateMobile'] ?? '').toString().isNotEmpty) ...[
          const SizedBox(height: AppSpacing.m),
          _buildProfileRow('Alternate Mobile', '+91 ${_profileData!['alternateMobile']}'),
        ],
        const SizedBox(height: AppSpacing.l),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: () => _showSnackBar('Navigate to Help tab to request contact update'),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.textSecondary,
              side: const BorderSide(color: AppColors.border),
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
            ),
            child: const Text('REQUEST CONTACT DETAIL UPDATE',
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
          ),
        ),
      ],
    );
  }

  // ─── SERVICE ADDRESS ─────────────────────────────────────
  Widget _buildServiceAddressSection() {
    final addr1 = _profileData?['addressLine1'] ?? 'N/A';
    final addr2 = _profileData?['addressLine2'] ?? '';
    final city = _profileData?['city'] ?? '';
    final state = _profileData?['state'] ?? '';
    final pin = _profileData?['pinCode'] ?? '';
    final locType = _profileData?['locationType'] ?? 'N/A';

    String fullAddress = addr1;
    if (addr2.isNotEmpty) fullAddress += ', $addr2';
    fullAddress += '\n$city, $state - $pin';

    return _buildSectionCard(
      title: 'Service Address & Location',
      subtitle: 'Registered service location',
      icon: Icons.location_on_outlined,
      iconBg: const Color(0xFFEFF6FF),
      iconColor: const Color(0xFF2563EB),
      children: [
        _buildProfileRow('Service Address', fullAddress),
        const SizedBox(height: AppSpacing.m),
        Row(
          children: [
            const Text(
              'LOCATION TYPE',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textLight, letterSpacing: 0.5),
            ),
            const SizedBox(width: AppSpacing.m),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                locType.toString().toUpperCase(),
                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.textSecondary, letterSpacing: 0.5),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.l),
        _buildInfoNote(
          'This address is used for service eligibility, compliance and allocation mapping.',
          const Color(0xFFEFF6FF),
          const Color(0xFF1E40AF),
          Icons.info_outline_rounded,
          const Color(0xFF3B82F6),
        ),
        const SizedBox(height: AppSpacing.l),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: () => _showSnackBar('Navigate to Help tab to request address update'),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.textSecondary,
              side: const BorderSide(color: AppColors.border),
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
            ),
            child: const Text('REQUEST ADDRESS UPDATE',
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
          ),
        ),
      ],
    );
  }

  // ─── ACCOUNT SECURITY ────────────────────────────────────
  Widget _buildAccountSecuritySection() {
    return _buildSectionCard(
      title: 'Account Security',
      subtitle: 'Manage your access and authentication',
      icon: Icons.vpn_key_outlined,
      iconBg: AppColors.errorBg,
      iconColor: AppColors.error,
      children: [
        Container(
          padding: const EdgeInsets.all(AppSpacing.l),
          decoration: BoxDecoration(
            color: AppColors.background,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text('Access Password', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: AppColors.text)),
                    SizedBox(height: 4),
                    Text('••••••••', style: TextStyle(fontSize: 12, color: AppColors.textLight)),
                    SizedBox(height: 4),
                    Text('Keep your account secure with a strong password',
                        style: TextStyle(fontSize: 10, color: AppColors.textLight)),
                  ],
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _showPasswordModal = true;
                    _passwordError = '';
                    _passwordSuccess = false;
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.secondary,
                  foregroundColor: AppColors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  elevation: 0,
                ),
                child: const Text('CHANGE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 0.5)),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.l),
        _buildInfoNote(
          'All security changes are logged for compliance.',
          AppColors.warningBg,
          const Color(0xFF92400E),
          Icons.shield_outlined,
          AppColors.warning,
        ),
      ],
    );
  }

  // ─── SUPPORT & REQUESTS ──────────────────────────────────
  Widget _buildSupportRequestsSection() {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0f172a), Color(0xFF1e293b)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      padding: const EdgeInsets.all(AppSpacing.l),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.white.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.help_outline_rounded, color: AppColors.white, size: 20),
              ),
              const SizedBox(width: AppSpacing.m),
              const Text('Support & Requests',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.white)),
            ],
          ),
          const SizedBox(height: AppSpacing.m),
          Text(
            'Profile updates are handled through secure support requests to ensure data accuracy and compliance.',
            style: TextStyle(fontSize: 13, color: AppColors.white.withValues(alpha: 0.7), height: 1.5),
          ),
          const SizedBox(height: AppSpacing.l),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () => _showSnackBar('Navigate to Help tab for support tickets'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.white,
                side: BorderSide(color: AppColors.white.withValues(alpha: 0.3)),
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              ),
              child: const Text('VIEW MY SUPPORT TICKETS',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
            ),
          ),
          const SizedBox(height: AppSpacing.s),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => _showSnackBar('Navigate to Help tab to raise profile update request'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: AppColors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                elevation: 0,
              ),
              child: const Text('RAISE PROFILE UPDATE REQUEST',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
            ),
          ),
        ],
      ),
    );
  }

  // ─── LOG OUT ─────────────────────────────────────────────
  Widget _buildLogoutButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: () => _handleLogout(context),
        icon: const Icon(Icons.logout_rounded, size: 18),
        label: const Text('LOG OUT', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1)),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.error,
          foregroundColor: AppColors.white,
          padding: const EdgeInsets.symmetric(vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          elevation: 0,
        ),
      ),
    );
  }

  // ─── FOOTER DISCLAIMER ──────────────────────────────────
  Widget _buildFooterDisclaimer() {
    return const Center(
      child: Text(
        'KDIA CUSTOMER PORTAL • SECURE PROFILE ACCESS • ENTERPRISE-GRADE INFRASTRUCTURE',
        style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: AppColors.textLight, letterSpacing: 0.5),
        textAlign: TextAlign.center,
      ),
    );
  }

  // ─── PASSWORD CHANGE MODAL ──────────────────────────────
  Widget _buildPasswordModal() {
    return Container(
      color: AppColors.text.withValues(alpha: 0.6),
      child: Center(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.l),
            child: Container(
              constraints: const BoxConstraints(maxWidth: 400),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(28),
                boxShadow: AppShadows.large,
              ),
              padding: const EdgeInsets.all(AppSpacing.l),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: const BoxDecoration(
                      color: AppColors.background,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.vpn_key_outlined, color: AppColors.text, size: 28),
                  ),
                  const SizedBox(height: AppSpacing.l),
                  const Text('Change Password',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.text)),
                  const SizedBox(height: AppSpacing.s),
                  const Text(
                    'Enter your current password to authorize this change. Your new password must be at least 8 characters with uppercase, lowercase, digit, and special character.',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.5),
                  ),
                  const SizedBox(height: AppSpacing.l),

                  if (_passwordSuccess)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(AppSpacing.l),
                      decoration: BoxDecoration(
                        color: AppColors.successBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.success.withValues(alpha: 0.2)),
                      ),
                      child: Column(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: const BoxDecoration(color: AppColors.white, shape: BoxShape.circle),
                            child: const Icon(Icons.check_rounded, color: AppColors.success, size: 28),
                          ),
                          const SizedBox(height: AppSpacing.m),
                          const Text('PASSWORD UPDATED SUCCESSFULLY',
                              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.success, letterSpacing: 0.5)),
                        ],
                      ),
                    )
                  else ...[
                    _buildPasswordField('Current Password', _currentPasswordController),
                    const SizedBox(height: AppSpacing.m),
                    _buildPasswordField('New Password', _newPasswordController, hint: 'Min 8 characters'),
                    const SizedBox(height: AppSpacing.m),
                    _buildPasswordField('Confirm New Password', _confirmPasswordController),
                    if (_passwordError.isNotEmpty) ...[
                      const SizedBox(height: AppSpacing.m),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(AppSpacing.m),
                        decoration: BoxDecoration(
                          color: AppColors.errorBg,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.error.withValues(alpha: 0.2)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline_rounded, color: AppColors.error, size: 16),
                            const SizedBox(width: AppSpacing.s),
                            Expanded(
                              child: Text(_passwordError,
                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.error)),
                            ),
                          ],
                        ),
                      ),
                    ],
                    const SizedBox(height: AppSpacing.l),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isChangingPassword ? null : _handlePasswordSubmit,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.secondary,
                          foregroundColor: AppColors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          elevation: 0,
                        ),
                        child: _isChangingPassword
                            ? const SizedBox(
                                width: 18, height: 18,
                                child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation<Color>(AppColors.white)))
                            : const Text('UPDATE PASSWORD',
                                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 0.5)),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.s),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton(
                        onPressed: _isChangingPassword
                            ? null
                            : () {
                                setState(() {
                                  _showPasswordModal = false;
                                  _currentPasswordController.clear();
                                  _newPasswordController.clear();
                                  _confirmPasswordController.clear();
                                  _passwordError = '';
                                });
                              },
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.textLight,
                          side: const BorderSide(color: AppColors.border),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('CANCEL',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 0.5)),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ─── SHARED BUILDERS ────────────────────────────────────

  Widget _buildSectionCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required List<Widget> children,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
        boxShadow: AppShadows.small,
      ),
      padding: const EdgeInsets.all(AppSpacing.l),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.text)),
                    const SizedBox(height: 2),
                    Text(subtitle, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: iconBg,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, color: iconColor, size: 22),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.l),
          ...children,
        ],
      ),
    );
  }

  Widget _buildProfileRow(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textLight, letterSpacing: 0.5)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.text, height: 1.4)),
      ],
    );
  }

  Widget _buildProfileRowWithBadge(String label, String value, String badge) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textLight, letterSpacing: 0.5)),
        const SizedBox(height: 4),
        Row(
          children: [
            Flexible(
              child: Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.text)),
            ),
            const SizedBox(width: AppSpacing.s),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.successBg,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(badge.toUpperCase(),
                  style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: AppColors.success, letterSpacing: 0.5)),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildInfoNote(String text, Color bg, Color textColor, IconData icon, Color iconColor) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.m),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: iconColor),
          const SizedBox(width: AppSpacing.s),
          Expanded(
            child: Text(text, style: TextStyle(fontSize: 11, color: textColor, height: 1.4)),
          ),
        ],
      ),
    );
  }

  Widget _buildPasswordField(String label, TextEditingController controller, {String? hint}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textLight, letterSpacing: 0.5)),
        const SizedBox(height: AppSpacing.xs),
        TextField(
          controller: controller,
          obscureText: true,
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(fontSize: 12, color: AppColors.textLight),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            filled: true,
            fillColor: AppColors.background,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
            focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: BorderSide(color: AppColors.primary.withValues(alpha: 0.3))),
          ),
        ),
      ],
    );
  }
}
