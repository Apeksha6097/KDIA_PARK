import 'dart:math';
import 'package:flutter/material.dart';
import '../constants/theme.dart';

class UsageScreen extends StatefulWidget {
  const UsageScreen({super.key});

  @override
  State<UsageScreen> createState() => _UsageScreenState();
}

class _UsageScreenState extends State<UsageScreen> {
  String _randomFact = '';

  final List<String> _knowledgeFacts = [
    'Solar energy is one of the fastest-growing renewable energy sources in the world.',
    'Solar panels can still generate electricity on cloudy days.',
    'Renewable energy helps reduce dependence on fossil fuels.',
    'Solar power supports a cleaner and greener future.',
  ];

  @override
  void initState() {
    super.initState();
    _randomFact = _knowledgeFacts[Random().nextInt(_knowledgeFacts.length)];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Energy Usage',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
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
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.l),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Header Section
              _buildHeader(),
              const SizedBox(height: AppSpacing.xl),

              // 2. Subscription Overview Section
              _buildSubscriptionOverview(),
              const SizedBox(height: AppSpacing.xl),

              // 3. Purchased Capacity Details Section
              Text(
                'Capacity Details',
                style: AppTextStyles.h3.copyWith(fontSize: 16),
              ),
              const SizedBox(height: AppSpacing.m),
              _buildCapacityDetailsCard(),
              const SizedBox(height: AppSpacing.xl),

              // 4. Documents & Reports Section
              Text(
                'Documents & Reports',
                style: AppTextStyles.h3.copyWith(fontSize: 16),
              ),
              const SizedBox(height: AppSpacing.m),
              _buildDocumentsSection(context),
              const SizedBox(height: AppSpacing.xl),

              // 5. Subscription Benefits Section
              Text(
                'Subscription Benefits',
                style: AppTextStyles.h3.copyWith(fontSize: 16),
              ),
              const SizedBox(height: AppSpacing.m),
              _buildBenefitsSection(),
              const SizedBox(height: AppSpacing.xl),

              // 6. Solar Knowledge Corner Section
              _buildKnowledgeCorner(),
              const SizedBox(height: AppSpacing.xl),

              // 7. Quick Actions Section
              Text(
                'Quick Actions',
                style: AppTextStyles.h3.copyWith(fontSize: 16),
              ),
              const SizedBox(height: AppSpacing.m),
              _buildQuickActions(context),
              const SizedBox(height: AppSpacing.xl),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return const Text(
      'Manage your subscription details, documents, and solar benefits.',
      style: TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: AppColors.textSecondary,
        height: 1.5,
      ),
    );
  }

  Widget _buildSubscriptionOverview() {
    return Row(
      children: [
        Expanded(
          child: _buildSummaryCard(
            title: 'Subscription Type',
            value: 'Solar Premium',
            icon: Icons.workspace_premium_rounded,
            color: AppColors.primary,
            bgColor: AppColors.primaryLight,
          ),
        ),
        const SizedBox(width: AppSpacing.m),
        Expanded(
          child: _buildSummaryCard(
            title: 'Contract Duration',
            value: '12 Months',
            icon: Icons.calendar_month_rounded,
            color: AppColors.primary,
            bgColor: AppColors.primaryLight,
          ),
        ),
      ],
    );
  }

  Widget _buildSummaryCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
    required Color bgColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.m),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: AppShadows.small,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: bgColor,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: AppSpacing.m),
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppColors.textLight,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: AppTextStyles.h2.copyWith(fontSize: 15),
          ),
        ],
      ),
    );
  }

  Widget _buildCapacityDetailsCard() {
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Purchased Capacity',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textLight,
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
          const SizedBox(height: 4),
          Text(
            '5 KW',
            style: AppTextStyles.h2.copyWith(
              fontSize: 22,
              color: AppColors.primaryDark,
            ),
          ),
          const SizedBox(height: AppSpacing.m),
          const Divider(color: AppColors.border),
          const SizedBox(height: AppSpacing.m),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Purchase Date',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textLight,
                ),
              ),
              Text(
                '15 Jan 2026',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.text,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.s),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Expiry Date',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.warning,
                ),
              ),
              Text(
                '15 Jan 2027',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: AppColors.warning,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDocumentsSection(BuildContext context) {
    return Column(
      children: [
        _buildDocumentTile(
          context: context,
          icon: Icons.description_outlined,
          title: 'Agreement',
          subtitle: 'View subscription agreement',
        ),
        const SizedBox(height: AppSpacing.s),

        _buildDocumentTile(
          context: context,
          icon: Icons.receipt_long_rounded,
          title: 'Invoice',
          subtitle: 'Download invoice details',
        ),
      ],
    );
  }

  Widget _buildDocumentTile({
    required BuildContext context,
    required IconData icon,
    required String title,
    required String subtitle,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap ?? () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Opening $title...')),
        );
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.m),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.primaryLight.withOpacity(0.5),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: AppColors.primaryDark, size: 22),
            ),
            const SizedBox(width: AppSpacing.m),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppColors.text,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textLight,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.textLight, size: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildBenefitsSection() {
    return Column(
      children: [
        _buildBenefitItem(Icons.energy_savings_leaf_rounded, 'Renewable Energy Access'),
        const SizedBox(height: AppSpacing.s),
        _buildBenefitItem(Icons.eco_rounded, 'Long-Term Sustainability'),
        const SizedBox(height: AppSpacing.s),
        _buildBenefitItem(Icons.park_rounded, 'Environment-Friendly Initiative'),
      ],
    );
  }

  Widget _buildBenefitItem(IconData icon, String title) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.m, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
        boxShadow: AppShadows.small,
      ),
      child: Row(
        children: [
          Icon(icon, color: AppColors.success, size: 20),
          const SizedBox(width: AppSpacing.m),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppColors.text,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKnowledgeCorner() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDF4),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF86EFAC)),
      ),
      padding: const EdgeInsets.all(AppSpacing.m),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Text(
                '💡 Solar Knowledge Corner',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF166534),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.s),
          Text(
            _randomFact,
            style: const TextStyle(
              fontSize: 13,
              color: Color(0xFF14532D),
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Column(
      children: [

        _buildDocumentTile(
          context: context,
          icon: Icons.file_download_outlined,
          title: 'Download Statement',
          subtitle: 'Get PDF document',
        ),
        const SizedBox(height: AppSpacing.s),
        _buildDocumentTile(
          context: context,
          icon: Icons.support_agent_rounded,
          title: 'Contact Support',
          subtitle: 'Need help?',
        ),
      ],
    );
  }
}
