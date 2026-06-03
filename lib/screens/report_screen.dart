import 'package:flutter/material.dart';
import '../constants/theme.dart';

class ReportScreen extends StatelessWidget {
  const ReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Solar Report'),
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
              _buildReportCard(context),
              const SizedBox(height: AppSpacing.xl),
              Text(
                'Actions',
                style: AppTextStyles.h3.copyWith(fontSize: 16),
              ),
              const SizedBox(height: AppSpacing.m),
              _buildActionButtons(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildReportCard(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
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
                'Solar Premium Plan',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryDark,
                ),
              ),
              Container(
                decoration: BoxDecoration(
                  color: AppColors.successBg,
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.s,
                  vertical: 4,
                ),
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
          const SizedBox(height: AppSpacing.l),
          const Divider(color: AppColors.border),
          const SizedBox(height: AppSpacing.m),
          _buildDetailRow('Customer Name', 'Rahul Sharma'),
          _buildDetailRow('Project Name', 'KDIA Tech Park Unit A'),
          _buildDetailRow('Site Location', 'Bangalore South, Karnataka'),
          _buildDetailRow('Capacity Purchased', '5 KW'),
          _buildDetailRow('Purchase Date', '15 Jan 2026'),
          _buildDetailRow('Expiry Date', '15 Jan 2027'),
          _buildDetailRow('Plan Duration', '1 Year (12 Months)'),
          _buildDetailRow('Invoice Number', 'INV-2026-04281'),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.m),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: AppColors.textLight,
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.text,
              ),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Column(
      children: [
        _buildActionBtn(
          icon: Icons.download_rounded,
          label: 'Download Report',
          onPressed: () {
            _showMockAction(context, 'Downloading Report...');
          },
        ),
        const SizedBox(height: AppSpacing.m),
        _buildActionBtn(
          icon: Icons.description_outlined,
          label: 'View Agreement',
          onPressed: () {
            _showMockAction(context, 'Opening Agreement...');
          },
        ),
        const SizedBox(height: AppSpacing.m),
        _buildActionBtn(
          icon: Icons.support_agent_rounded,
          label: 'Contact Support',
          isPrimary: false,
          onPressed: () {
            _showMockAction(context, 'Contacting Support...');
          },
        ),
      ],
    );
  }

  Widget _buildActionBtn({
    required IconData icon,
    required String label,
    required VoidCallback onPressed,
    bool isPrimary = true,
  }) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: onPressed,
        icon: Icon(icon),
        label: Text(label),
        style: ElevatedButton.styleFrom(
          backgroundColor: isPrimary ? AppColors.primary : AppColors.white,
          foregroundColor: isPrimary ? AppColors.white : AppColors.primaryDark,
          elevation: isPrimary ? 2 : 0,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: isPrimary
                ? BorderSide.none
                : const BorderSide(color: AppColors.border, width: 1.5),
          ),
          textStyle: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
      ),
    );
  }

  void _showMockAction(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
