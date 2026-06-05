import 'dart:convert';
import 'package:flutter/material.dart';
import '../constants/theme.dart';
import '../services/api.dart';

class HelpScreen extends StatefulWidget {
  const HelpScreen({super.key});

  @override
  State<HelpScreen> createState() => _HelpScreenState();
}

class _HelpScreenState extends State<HelpScreen> {
  final ApiService _apiService = ApiService();
  bool _isLoading = true;
  bool _isSubmitting = false;
  Map<String, dynamic>? _userProfile;
  List<dynamic> _tickets = [];
  int? _expandedFaqIndex;

  // Standard Form State
  String? _selectedSubject;
  final TextEditingController _messageController = TextEditingController();

  // Profile Update Form State
  String _profileRequestField = 'contact'; // 'contact' or 'address'
  final TextEditingController _newEmailController = TextEditingController();
  final TextEditingController _newMobileController = TextEditingController();
  final TextEditingController _newAddress1Controller = TextEditingController();
  final TextEditingController _newAddress2Controller = TextEditingController();
  final TextEditingController _newCityController = TextEditingController();
  final TextEditingController _newStateController = TextEditingController();
  final TextEditingController _newPinController = TextEditingController();
  String _newLocationType = 'Residential';
  final TextEditingController _reasonController = TextEditingController();

  final List<Map<String, String>> _faqs = [
    {
      'question': 'How does energy allocation work?',
      'answer':
          'Your energy allocation represents a reserved portion of clean energy generated from our solar infrastructure. This allocation is credited against your electricity consumption by the grid authorities.'
    },
    {
      'question': 'How is my billing managed?',
      'answer':
          'Your electricity billing is managed entirely by your local DISCOM (Distribution Company). KDIA Re Park ensures your clean energy allocation is active, but we do not track your real-time usage or generate electricity bills.'
    },
    {
      'question': 'Who handles my electricity billing?',
      'answer':
          'Your electricity billing continues to be managed by your local DISCOM (Distribution Company). KDIA Re Park provides the clean energy allocation infrastructure, while your regular electricity provider handles all billing, payments, and customer service for your electricity account.'
    },
    {
      'question': 'How do I update my account information?',
      'answer':
          'Account information updates are currently managed through our administrative team to ensure data accuracy and regulatory compliance. Please use the contact form below to request any changes to your profile, and our team will assist you with the update process.'
    }
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _newEmailController.dispose();
    _newMobileController.dispose();
    _newAddress1Controller.dispose();
    _newAddress2Controller.dispose();
    _newCityController.dispose();
    _newStateController.dispose();
    _newPinController.dispose();
    _reasonController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
    });

    // Static demo profile — used as fallback if backend is not running
    const demoProfile = {
      'fullName': 'Rahul Sharma (Demo)',
      'email': 'rahul.sharma@example.com',
      'mobileNumber': '+91 9876543210',
      'consumerId': 'KDIA-2026-00142',
      'addressLine1': '12, Green Valley Society',
      'addressLine2': 'Near Solar Park, Phalodi',
      'city': 'Jodhpur',
      'state': 'Rajasthan',
      'pinCode': '342001',
      'locationType': 'Residential',
    };

    try {
      // Attempt live profile load
      final profileRes = await _apiService.getProfile();
      if (profileRes['success'] == true && profileRes['data'] != null) {
        _userProfile = profileRes['data'];
      } else {
        // Fallback to demo data — allows page to render for UI preview
        _userProfile = demoProfile;
      }
      _initProfileUpdateControllers();

      // Attempt live tickets load
      await _fetchTickets();
    } catch (e) {
      debugPrint('Error loading support data: $e');
      // Always fall back to demo data so UI is never blocked
      _userProfile = demoProfile;
      _initProfileUpdateControllers();
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _initProfileUpdateControllers() {
    if (_userProfile != null) {
      _newEmailController.text = _userProfile!['email'] ?? '';
      _newMobileController.text = _userProfile!['mobileNumber'] ?? '';
      _newAddress1Controller.text = _userProfile!['addressLine1'] ?? '';
      _newAddress2Controller.text = _userProfile!['addressLine2'] ?? '';
      _newCityController.text = _userProfile!['city'] ?? '';
      _newStateController.text = _userProfile!['state'] ?? '';
      _newPinController.text = _userProfile!['pinCode'] ?? '';
      _newLocationType = _userProfile!['locationType'] ?? 'Residential';
    }
  }

  Future<void> _fetchTickets() async {
    try {
      final ticketsRes = await _apiService.getSupportTickets();
      if (ticketsRes['success'] == true) {
        setState(() {
          _tickets = ticketsRes['data'] ?? [];
        });
      }
    } catch (e) {
      debugPrint('Error fetching tickets: $e');
    }
  }

  Future<void> _handleSubmit() async {
    if (_selectedSubject == null) {
      _showSnackBar('Please select a subject', isError: true);
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    try {
      if (_selectedSubject == 'PROFILE_UPDATE_REQUEST') {
        if (_reasonController.text.trim().isEmpty) {
          _showSnackBar('Please provide a reason for the update', isError: true);
          return;
        }

        // Construct structured payload
        final Map<String, dynamic> changes = {
          'type': _profileRequestField,
          'current': {},
          'requested': {},
          'reason': _reasonController.text.trim(),
        };

        if (_profileRequestField == 'contact') {
          changes['current'] = {
            'email': _userProfile?['email'],
            'mobile': _userProfile?['mobileNumber'],
          };
          changes['requested'] = {
            'email': _newEmailController.text.trim(),
            'mobile': _newMobileController.text.trim(),
          };
        } else {
          changes['current'] = {
            'address1': _userProfile?['addressLine1'],
            'address2': _userProfile?['addressLine2'],
            'city': _userProfile?['city'],
            'state': _userProfile?['state'],
            'pin': _userProfile?['pinCode'],
            'type': _userProfile?['locationType'],
          };
          changes['requested'] = {
            'address1': _newAddress1Controller.text.trim(),
            'address2': _newAddress2Controller.text.trim(),
            'city': _newCityController.text.trim(),
            'state': _newStateController.text.trim(),
            'pin': _newPinController.text.trim(),
            'type': _newLocationType,
          };
        }

        final subjectText = _profileRequestField == 'contact'
            ? 'Profile Update Request: Contact Details'
            : 'Profile Update Request: Service Address';

        final res = await _apiService.createSupportTicket(
          subject: subjectText,
          description: jsonEncode(changes),
          category: 'PROFILE_UPDATE_REQUEST',
        );

        if (res['success'] == true) {
          _showSnackBar('Your change request has been submitted successfully.');
          _reasonController.clear();
          setState(() {
            _selectedSubject = null;
          });
          await _fetchTickets();
        } else {
          _showSnackBar(res['message'] ?? 'Failed to submit request', isError: true);
        }
      } else {
        // Standard Ticket Submission
        if (_messageController.text.trim().length < 10) {
          _showSnackBar('Message must be at least 10 characters long', isError: true);
          return;
        }

        final res = await _apiService.createSupportTicket(
          subject: _selectedSubject!,
          description: _messageController.text.trim(),
          category: _selectedSubject!,
        );

        if (res['success'] == true) {
          _showSnackBar('Your query has been shared with the KDIA team.');
          _messageController.clear();
          setState(() {
            _selectedSubject = null;
          });
          await _fetchTickets();
        } else {
          _showSnackBar(res['message'] ?? 'Failed to submit query', isError: true);
        }
      }
    } catch (e) {
      _showSnackBar('An unexpected error occurred. Please try again.', isError: true);
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  Future<void> _handleRevoke(int ticketId) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Revoke Ticket', style: TextStyle(fontWeight: FontWeight.bold)),
        content: const Text('Are you sure you want to revoke this support ticket? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel', style: TextStyle(color: AppColors.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              foregroundColor: AppColors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('Revoke'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    try {
      final res = await _apiService.revokeSupportTicket(ticketId);
      if (res['success'] == true) {
        _showSnackBar('Ticket revoked successfully.');
        await _fetchTickets();
      } else {
        _showSnackBar(res['message'] ?? 'Failed to revoke ticket.', isError: true);
      }
    } catch (e) {
      _showSnackBar('An error occurred. Please try again.', isError: true);
    }
  }

  void _showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.white),
        ),
        backgroundColor: isError ? AppColors.error : AppColors.success,
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
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
          ),
        ),
      );
    }

    if (_userProfile == null) {
      return Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          title: const Text('Help & Support', style: TextStyle(fontWeight: FontWeight.w700)),
          backgroundColor: AppColors.white,
          foregroundColor: AppColors.text,
          elevation: 0,
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.l),
            child: Container(
              padding: const EdgeInsets.all(AppSpacing.l),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.errorBg, width: 2),
                boxShadow: AppShadows.medium,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: const BoxDecoration(
                      color: AppColors.errorBg,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.warning_amber_rounded, color: AppColors.error, size: 36),
                  ),
                  const SizedBox(height: AppSpacing.l),
                  const Text(
                    'Unable to Load Support Center',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.s),
                  const Text(
                    'We\'re having trouble accessing your profile data. Please try refreshing the page or logging in again.',
                    style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.l),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _loadData,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: AppColors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Refresh Page', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.m),
                  TextButton(
                    onPressed: () => Navigator.of(context).pushReplacementNamed('/login'),
                    child: const Text(
                      'SIGN OUT & TRY AGAIN',
                      style: TextStyle(fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 1),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Help & Support', style: TextStyle(fontWeight: FontWeight.w700)),
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
        child: RefreshIndicator(
          onRefresh: _loadData,
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

                // 2. Quick Links
                _buildQuickLinks(),
                const SizedBox(height: AppSpacing.xl),

                // 3. FAQ Section
                _buildFAQSection(),
                const SizedBox(height: AppSpacing.xl),

                // 4. Contact/Support Form
                _buildContactForm(),
                const SizedBox(height: AppSpacing.xl),

                // 5. My Support Requests
                _buildSupportRequests(),
                const SizedBox(height: AppSpacing.xxl),

                // 6. Trust Note
                _buildTrustNote(),
              ],
            ),
          ),
        ),
      ),
    );
  }

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
              color: AppColors.white.withOpacity(0.12),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.white.withOpacity(0.2)),
            ),
            child: const Text(
              'SUPPORT & HELP',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w900,
                color: AppColors.primaryLight,
                letterSpacing: 1.5,
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.m),
          const Text(
            'We\'re Here to Help',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w900,
              color: AppColors.white,
              height: 1.2,
            ),
          ),
          const SizedBox(height: AppSpacing.m),
          Text(
            'Access informational guidance and technical resources. This space is dedicated to your understanding of KDIA clean energy infrastructure—without commercial pressure.',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: AppColors.white.withOpacity(0.8),
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickLinks() {
    return Row(
      children: [
        Expanded(
          child: _buildQuickLinkCard(
            title: 'Dashboard',
            subtitle: 'View your allocation',
            icon: Icons.home_rounded,
            isActive: false,
            onTap: () {
              Navigator.of(context).pushReplacementNamed('/home');
            },
          ),
        ),
        const SizedBox(width: AppSpacing.m),
        Expanded(
          child: _buildQuickLinkCard(
            title: 'Support & Help',
            subtitle: 'You are here',
            icon: Icons.help_outline_rounded,
            isActive: true,
            onTap: () {},
          ),
        ),
      ],
    );
  }

  Widget _buildQuickLinkCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.m),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isActive ? AppColors.primary.withOpacity(0.3) : AppColors.border,
            width: isActive ? 2 : 1,
          ),
          boxShadow: isActive ? AppShadows.medium : AppShadows.small,
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isActive ? AppColors.primary : AppColors.background,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                icon,
                color: isActive ? AppColors.white : AppColors.textSecondary,
                size: 20,
              ),
            ),
            const SizedBox(width: AppSpacing.s),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: isActive ? AppColors.primaryDark : AppColors.text,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 10,
                      color: AppColors.textLight,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFAQSection() {
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
          const Text(
            'Frequently Asked Questions',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text),
          ),
          const SizedBox(height: AppSpacing.l),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _faqs.length,
            separatorBuilder: (context, index) => const SizedBox(height: AppSpacing.s),
            itemBuilder: (context, index) {
              final isExpanded = _expandedFaqIndex == index;
              return Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Material(
                    color: AppColors.white,
                    child: Column(
                      children: [
                        InkWell(
                          onTap: () {
                            setState(() {
                              _expandedFaqIndex = isExpanded ? null : index;
                            });
                          },
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.m, vertical: AppSpacing.m),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    _faqs[index]['question']!,
                                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.text),
                                  ),
                                ),
                                Icon(
                                  isExpanded ? Icons.expand_less_rounded : Icons.expand_more_rounded,
                                  color: AppColors.primary,
                                ),
                              ],
                            ),
                          ),
                        ),
                        if (isExpanded)
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.fromLTRB(AppSpacing.m, 0, AppSpacing.m, AppSpacing.m),
                            child: Text(
                              _faqs[index]['answer']!,
                              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.5),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildContactForm() {
    final isProfileUpdate = _selectedSubject == 'PROFILE_UPDATE_REQUEST';

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
          Text(
            isProfileUpdate ? 'Update Account Information' : 'Contact KDIA Support',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text),
          ),
          const SizedBox(height: AppSpacing.s),
          Text(
            isProfileUpdate
                ? 'Please review your current details and specify the changes required.'
                : 'If you have specific allocation queries or need billing clarification, our team is here to help.',
            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppSpacing.l),

          // User Info Box (Autopopulated)
          Container(
            padding: const EdgeInsets.all(AppSpacing.m),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              children: [
                _buildInfoRow('Customer Name', _userProfile?['fullName'] ?? ''),
                const Divider(height: 16),
                _buildInfoRow('Consumer ID', _userProfile?['consumerId'] ?? '', isMono: true),
                const Divider(height: 16),
                _buildInfoRow('Email Address', _userProfile?['email'] ?? ''),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.l),

          // Subject Dropdown
          const Text(
            'Subject',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5),
          ),
          const SizedBox(height: AppSpacing.xs),
          DropdownButtonFormField<String>(
            value: _selectedSubject,
            hint: const Text('Select a subject', style: TextStyle(fontSize: 13)),
            items: const [
              DropdownMenuItem(value: 'General Question', child: Text('General Question', style: TextStyle(fontSize: 13))),
              DropdownMenuItem(value: 'Billing & Metering Query', child: Text('Billing & Metering Query', style: TextStyle(fontSize: 13))),
              DropdownMenuItem(value: 'Allocation Related', child: Text('Allocation Related', style: TextStyle(fontSize: 13))),
              DropdownMenuItem(value: 'PROFILE_UPDATE_REQUEST', child: Text('Profile Update Request', style: TextStyle(fontSize: 13))),
              DropdownMenuItem(value: 'Other', child: Text('Other', style: TextStyle(fontSize: 13))),
            ],
            onChanged: (val) {
              setState(() {
                _selectedSubject = val;
                if (val == 'PROFILE_UPDATE_REQUEST') {
                  _initProfileUpdateControllers();
                }
              });
            },
            decoration: InputDecoration(
              contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.m, vertical: 12),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.border)),
              focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.primary)),
            ),
          ),
          const SizedBox(height: AppSpacing.l),

          if (isProfileUpdate) ...[
            // Toggle for contact vs address update
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      setState(() {
                        _profileRequestField = 'contact';
                      });
                    },
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(
                        color: _profileRequestField == 'contact' ? AppColors.primary : AppColors.border,
                        width: _profileRequestField == 'contact' ? 2 : 1,
                      ),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      backgroundColor: _profileRequestField == 'contact' ? AppColors.primaryLight.withOpacity(0.3) : Colors.transparent,
                    ),
                    child: const Text('Contact Details', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.text)),
                  ),
                ),
                const SizedBox(width: AppSpacing.s),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      setState(() {
                        _profileRequestField = 'address';
                      });
                    },
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(
                        color: _profileRequestField == 'address' ? AppColors.primary : AppColors.border,
                        width: _profileRequestField == 'address' ? 2 : 1,
                      ),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      backgroundColor: _profileRequestField == 'address' ? AppColors.primaryLight.withOpacity(0.3) : Colors.transparent,
                    ),
                    child: const Text('Service Address', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.text)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.l),

            // Profile update comparison grid
            Container(
              padding: const EdgeInsets.all(AppSpacing.m),
              decoration: BoxDecoration(
                color: AppColors.primaryLight.withOpacity(0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.primary.withOpacity(0.15)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _profileRequestField == 'contact' ? 'NEW CONTACT DETAILS' : 'NEW SERVICE ADDRESS',
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.primaryDark, letterSpacing: 1),
                  ),
                  const SizedBox(height: AppSpacing.m),
                  if (_profileRequestField == 'contact') ...[
                    _buildTextField(
                      controller: _newEmailController,
                      label: 'New Email Address',
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: AppSpacing.m),
                    _buildTextField(
                      controller: _newMobileController,
                      label: 'New Mobile Number',
                      keyboardType: TextInputType.phone,
                    ),
                  ] else ...[
                    _buildTextField(
                      controller: _newAddress1Controller,
                      label: 'Address Line 1',
                    ),
                    const SizedBox(height: AppSpacing.m),
                    _buildTextField(
                      controller: _newAddress2Controller,
                      label: 'Address Line 2',
                    ),
                    const SizedBox(height: AppSpacing.m),
                    Row(
                      children: [
                        Expanded(
                          child: _buildTextField(
                            controller: _newCityController,
                            label: 'City',
                          ),
                        ),
                        const SizedBox(width: AppSpacing.m),
                        Expanded(
                          child: _buildTextField(
                            controller: _newPinController,
                            label: 'PIN Code',
                            keyboardType: TextInputType.number,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.m),
                    Row(
                      children: [
                        Expanded(
                          child: _buildTextField(
                            controller: _newStateController,
                            label: 'State',
                          ),
                        ),
                        const SizedBox(width: AppSpacing.m),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Location Type',
                                style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textSecondary),
                              ),
                              const SizedBox(height: AppSpacing.xs),
                              DropdownButtonFormField<String>(
                                value: _newLocationType,
                                items: const [
                                  DropdownMenuItem(value: 'Residential', child: Text('Residential', style: TextStyle(fontSize: 12))),
                                  DropdownMenuItem(value: 'Commercial', child: Text('Commercial', style: TextStyle(fontSize: 12))),
                                  DropdownMenuItem(value: 'Industrial', child: Text('Industrial', style: TextStyle(fontSize: 12))),
                                ],
                                onChanged: (val) {
                                  if (val != null) {
                                    setState(() {
                                      _newLocationType = val;
                                    });
                                  }
                                },
                                decoration: InputDecoration(
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.l),

            // Reason for change
            _buildTextField(
              controller: _reasonController,
              label: 'Reason for Change (Required)',
              maxLines: 3,
              hint: 'Why is this update required?',
            ),
          ] else ...[
            // Message (Standard message field)
            _buildTextField(
              controller: _messageController,
              label: 'Message',
              maxLines: 5,
              hint: 'Describe your query here...',
            ),
            const SizedBox(height: AppSpacing.xs),
            const Text(
              'Please provide at least 10 characters.',
              style: TextStyle(fontSize: 10, color: AppColors.textLight),
            ),
          ],
          const SizedBox(height: AppSpacing.l),

          // Submit Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _isSubmitting ? null : _handleSubmit,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.secondary,
                foregroundColor: AppColors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 0,
              ),
              child: _isSubmitting
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(AppColors.white),
                      ),
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.mail_outline_rounded, size: 18),
                        SizedBox(width: 8),
                        Text('Send Message', style: TextStyle(fontWeight: FontWeight.bold)),
                      ],
                    ),
            ),
          ),
          const SizedBox(height: AppSpacing.m),

          // Disclaimer helper text
          const Text(
            'SUPPORT REQUESTS ARE REVIEWED BY THE KDIA RE PARK TEAM. RESPONSES MAY BE PROVIDED VIA REGISTERED CONTACT DETAILS.',
            style: TextStyle(
              fontSize: 9,
              fontWeight: FontWeight.bold,
              color: AppColors.textLight,
              letterSpacing: 0.5,
              height: 1.4,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isMono = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textLight, letterSpacing: 0.5),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: isMono ? AppColors.primaryDark : AppColors.text,
            fontFamily: isMono ? 'monospace' : null,
          ),
        ),
      ],
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    int maxLines = 1,
    String? hint,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textSecondary),
        ),
        const SizedBox(height: AppSpacing.xs),
        TextField(
          controller: controller,
          maxLines: maxLines,
          keyboardType: keyboardType,
          style: const TextStyle(fontSize: 13),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(fontSize: 13, color: AppColors.textLight),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.border)),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.primary)),
          ),
        ),
      ],
    );
  }

  Widget _buildSupportRequests() {
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
          const Text(
            'My Support Requests',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text),
          ),
          const SizedBox(height: AppSpacing.s),
          const Text(
            'Track the status of your reported infrastructure queries.',
            style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppSpacing.l),

          if (_tickets.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 40),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border, style: BorderStyle.solid),
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: const BoxDecoration(color: AppColors.white, shape: BoxShape.circle),
                    child: const Icon(Icons.folder_open_rounded, color: AppColors.textLight, size: 28),
                  ),
                  const SizedBox(height: AppSpacing.m),
                  const Text(
                    'YOU HAVE NOT RAISED ANY SUPPORT REQUESTS YET.',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textLight, letterSpacing: 0.5),
                  ),
                ],
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _tickets.length,
              separatorBuilder: (context, index) => const SizedBox(height: AppSpacing.m),
              itemBuilder: (context, index) {
                final ticket = _tickets[index];
                final ticketId = ticket['id'] ?? 0;
                final subject = ticket['subject'] ?? '';
                final description = ticket['description'] ?? '';
                final createdAtStr = ticket['createdAt'] ?? '';
                final status = ticket['status'] ?? 'PENDING';

                DateTime? createdAt;
                if (createdAtStr.isNotEmpty) {
                  try {
                    createdAt = DateTime.parse(createdAtStr);
                  } catch (_) {}
                }

                String formattedDate = '';
                if (createdAt != null) {
                  final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  formattedDate = '${createdAt.day.toString().padLeft(2, '0')} ${months[createdAt.month - 1]} ${createdAt.year}';
                }

                return Container(
                  padding: const EdgeInsets.all(AppSpacing.m),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '#TK-${1000 + ticketId}',
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textLight),
                          ),
                          _buildStatusBadge(status),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.s),
                      Text(
                        subject,
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.text),
                      ),
                      if (description.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          description.startsWith('{')
                              ? _parseProfileChangeDescription(description)
                              : description,
                          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                      const SizedBox(height: AppSpacing.m),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            formattedDate,
                            style: const TextStyle(fontSize: 11, color: AppColors.textLight),
                          ),
                          if (status == 'PENDING' || status == 'IN_PROGRESS')
                            TextButton(
                              onPressed: () => _handleRevoke(ticketId),
                              style: TextButton.styleFrom(
                                minimumSize: Size.zero,
                                padding: EdgeInsets.zero,
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              ),
                              child: const Text(
                                'Revoke',
                                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.error),
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          const SizedBox(height: AppSpacing.l),
          Row(
            children: const [
              Icon(Icons.info_outline_rounded, size: 14, color: AppColors.textLight),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Support ticket statuses are updated by the KDIA Re Park team.',
                  style: TextStyle(fontSize: 10, color: AppColors.textLight, fontStyle: FontStyle.italic),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _parseProfileChangeDescription(String descJson) {
    try {
      final data = jsonDecode(descJson);
      final type = data['type'] ?? '';
      final reason = data['reason'] ?? '';
      final fieldText = type == 'contact' ? 'Contact details' : 'Service address';
      return 'Request to update $fieldText. Reason: $reason';
    } catch (_) {
      return descJson;
    }
  }

  Widget _buildStatusBadge(String status) {
    Color bg = AppColors.background;
    Color text = AppColors.textSecondary;
    String label = status;

    switch (status) {
      case 'PENDING':
        bg = AppColors.warningBg;
        text = AppColors.warning;
        label = 'Pending';
        break;
      case 'IN_PROGRESS':
        bg = const Color(0xFFEFF6FF);
        text = const Color(0xFF1D4ED8);
        label = 'In Progress';
        break;
      case 'RESOLVED':
        bg = AppColors.successBg;
        text = AppColors.success;
        label = 'Resolved';
        break;
      case 'REVOKED':
        bg = AppColors.background;
        text = AppColors.textLight;
        label = 'Revoked';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: text.withOpacity(0.15)),
      ),
      child: Text(
        label.toUpperCase(),
        style: TextStyle(
          fontSize: 9,
          fontWeight: FontWeight.w900,
          color: text,
          letterSpacing: 0.5,
        ),
      ),
    );
  }

  Widget _buildTrustNote() {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: AppSpacing.m),
      child: Text(
        'All values shown in this portal are indicative and informational.\nElectricity billing continues to be handled by your DISCOM.',
        style: TextStyle(
          fontSize: 10,
          color: AppColors.textLight,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
          height: 1.5,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}
