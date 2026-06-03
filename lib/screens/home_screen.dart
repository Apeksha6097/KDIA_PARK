import 'dart:math';
import 'package:flutter/material.dart';
import '../constants/theme.dart';
import '../services/api.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService _apiService = ApiService();
  bool _isLoading = true;
  bool _isRefreshing = false;
  String _userName = 'Rahul Sharma';
  
  // Static Dashboard state variables
  final double _totalConsumed = 120;

  static const double tariffPerKwh = 6.5;
  static const double co2PerKwh = 0.82;

  String _randomFact = '';

  final List<String> _solarFacts = [
    'Solar energy is the most abundant energy source on Earth.',
    'A single hour of sunlight can power the world for a year.',
    'Solar panels can work even on cloudy days.',
    'Solar energy reduces carbon emissions significantly.',
    'Renewable energy helps reduce dependence on fossil fuels.'
  ];

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    if (!_isRefreshing) {
      setState(() {
        _isLoading = true;
      });
    }

    _randomFact = _solarFacts[Random().nextInt(_solarFacts.length)];

    try {
      final name = await _apiService.getUserFullName();
      if (mounted) {
        setState(() {
          if (name != null && name.isNotEmpty) {
            _userName = name.replaceAll(' (Demo)', '');
          } else {
            _userName = 'Rahul Sharma';
          }
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _userName = 'Rahul Sharma';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _isRefreshing = false;
        });
      }
    }
  }

  Future<void> _onRefresh() async {
    setState(() {
      _isRefreshing = true;
    });
    await _loadDashboardData();
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

    // Calculations

    final int monthlySavings = (_totalConsumed * tariffPerKwh).round();
    final double co2Saved = _totalConsumed * co2PerKwh;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _onRefresh,
          color: AppColors.primary,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Header
                _buildHeader(),

                // Main Content Padding
                Padding(
                  padding: const EdgeInsets.all(AppSpacing.l),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Solar Report Card
                      _buildSolarReportCard(context),
                      const SizedBox(height: AppSpacing.m),

                      // Section Title: Your Solar Impact
                      Text('Your Solar Impact', style: AppTextStyles.h3.copyWith(fontSize: 16)),
                      const SizedBox(height: AppSpacing.m),

                      // Solar Impact Grid
                      _buildSolarImpactGrid(monthlySavings, co2Saved),
                      const SizedBox(height: AppSpacing.xl),

                      // New Why Choose KDIA Section
                      Text("Why Choose KDIA?", style: AppTextStyles.h3.copyWith(fontSize: 16)),
                      const SizedBox(height: AppSpacing.m),
                      _buildWhyChooseKdiaCard(),
                      const SizedBox(height: AppSpacing.l),

                      // Insights / Tips Card
                      _buildInsightCard(),
                      const SizedBox(height: AppSpacing.l),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        border: const Border(
          bottom: BorderSide(color: AppColors.border, width: 1),
        ),
        boxShadow: AppShadows.small,
      ),
      padding: const EdgeInsets.fromLTRB(AppSpacing.l, AppSpacing.m, AppSpacing.l, AppSpacing.l),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Image.asset(
                'assets/images/logo.png',
                width: 120,
                height: 40,
                fit: BoxFit.contain,
              ),
              // We moved the logout to the profile page in a previous step, but if we need a quick action here, 
              // we can keep it or remove it. Let's replace it with a user avatar placeholder to look cleaner.
              CircleAvatar(
                radius: 18,
                backgroundColor: AppColors.primaryLight,
                child: Text(
                  _userName.isNotEmpty ? _userName[0].toUpperCase() : 'U',
                  style: const TextStyle(
                    color: AppColors.primaryDark,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              )
            ],
          ),
          const SizedBox(height: AppSpacing.l),
          const Text(
            'Welcome back,',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: AppColors.textLight,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            _userName,
            style: AppTextStyles.h1.copyWith(fontSize: 24, height: 1.2),
          ),
          const SizedBox(height: 8),
          const Text(
            'Powering a greener future with clean energy.',
            style: TextStyle(
              fontSize: 13,
              color: AppColors.primary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSolarReportCard(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.black.withOpacity(0.02)),
        boxShadow: AppShadows.medium,
      ),
      padding: const EdgeInsets.all(AppSpacing.l),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                '📄 My Solar Report',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.text,
                ),
              ),
              Container(
                decoration: BoxDecoration(
                  color: AppColors.successBg,
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s, vertical: 4),
                child: const Text(
                  'ACTIVE',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: AppColors.success,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.m),
          _buildReportSummaryRow('Plan Name:', 'Solar Premium'),
          _buildReportSummaryRow('Capacity Purchased:', '5 KW'),
          _buildReportSummaryRow('Purchase Date:', '15 Jan 2026'),
          _buildReportSummaryRow('Expiry Date:', '15 Jan 2027'),
          const SizedBox(height: AppSpacing.l),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () {
                Navigator.of(context).pushNamed('/report');
              },
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.primary,
                side: const BorderSide(color: AppColors.primary),
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                textStyle: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                ),
              ),
              child: const Text('View Full Report'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReportSummaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: AppColors.textLight,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.text,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSolarImpactGrid(int monthlySavings, double co2Saved) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final double itemWidth = (constraints.maxWidth - AppSpacing.m) / 2;
        return Wrap(
          spacing: AppSpacing.m,
          runSpacing: AppSpacing.m,
          children: [
            _buildGridItem(
              width: itemWidth,
              icon: '💰',
              iconBg: const Color(0xFFE0F2FE),
              value: '₹$monthlySavings',
              label: 'Est. Monthly Savings',
            ),
            _buildGridItem(
              width: itemWidth,
              icon: '📈',
              iconBg: const Color(0xFFF0FDF4),
              value: '₹${(monthlySavings * 14)}',
              label: 'Lifetime Savings',
            ),
            _buildGridItem(
              width: itemWidth,
              icon: '☁️',
              iconBg: const Color(0xFFFFF7ED),
              value: '${co2Saved.toStringAsFixed(1)} kg',
              label: 'CO₂ Reduction',
            ),
            _buildGridItem(
              width: itemWidth,
              icon: '🌳',
              iconBg: const Color(0xFFF3F4F6),
              value: '${(co2Saved / 21).round()}',
              label: 'Equivalent Trees',
            ),
          ],
        );
      },
    );
  }

  Widget _buildGridItem({
    required double width,
    required String icon,
    required Color iconBg,
    required String value,
    required String label,
  }) {
    return Container(
      width: width,
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: AppShadows.small,
      ),
      padding: const EdgeInsets.all(AppSpacing.m),
      child: Column(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: iconBg,
              shape: BoxShape.circle,
            ),
            alignment: Alignment.center,
            child: Text(
              icon,
              style: const TextStyle(fontSize: 22),
            ),
          ),
          const SizedBox(height: AppSpacing.s),
          Text(
            value,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppColors.text,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              color: AppColors.textLight,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildWhyChooseKdiaCard() {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: AppShadows.small,
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
                  color: AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.wb_sunny_rounded, color: AppColors.primary, size: 24),
              ),
              const SizedBox(width: AppSpacing.m),
              const Expanded(
                child: Text(
                  'Reliable Green Energy',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: AppColors.text,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.m),
          const Text(
            'KDIA provides sustainable, cost-effective, and uninterrupted solar energy solutions tailored for your future. Switch today and shrink your carbon footprint.',
            style: TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInsightCard() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFFFFBEB),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFFCD34D)),
      ),
      padding: const EdgeInsets.all(AppSpacing.m),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Text(
                '💡 Did You Know?',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFB45309),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.s),
          Text(
            _randomFact,
            style: const TextStyle(
              fontSize: 13,
              color: Color(0xFF92400E),
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}
