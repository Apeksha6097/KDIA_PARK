import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF0d9488); // KDIA Teal
  static const Color primaryDark = Color(0xFF0f766e);
  static const Color primaryLight = Color(0xFFccfbf1);
  static const Color secondary = Color(0xFF0f172a); // Slate 900
  static const Color background = Color(0xFFf8f9fa);
  static const Color card = Color(0xFFFFFFFF);
  static const Color text = Color(0xFF1e293b);
  static const Color textSecondary = Color(0xFF64748b);
  static const Color textLight = Color(0xFF94a3b8);
  static const Color border = Color(0xFFe2e8f0);
  static const Color success = Color(0xFF10b981);
  static const Color successBg = Color(0xFFd1fae5);
  static const Color warning = Color(0xFFf59e0b);
  static const Color warningBg = Color(0xFFfef3c7);
  static const Color error = Color(0xFFef4444);
  static const Color errorBg = Color(0xFFfee2e2);
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
}

class AppSpacing {
  static const double xs = 4.0;
  static const double s = 8.0;
  static const double m = 16.0;
  static const double l = 24.0;
  static const double xl = 32.0;
  static const double xxl = 40.0;
}

class AppShadows {
  static List<BoxShadow> get small => [
        BoxShadow(
          color: Colors.black.withOpacity(0.04),
          offset: const Offset(0, 1),
          blurRadius: 2,
        ),
      ];

  static List<BoxShadow> get medium => [
        BoxShadow(
          color: Colors.black.withOpacity(0.06),
          offset: const Offset(0, 2),
          blurRadius: 6,
        ),
      ];

  static List<BoxShadow> get large => [
        BoxShadow(
          color: Colors.black.withOpacity(0.08),
          offset: const Offset(0, 10),
          blurRadius: 20,
        ),
      ];
}

class AppTextStyles {
  static const TextStyle h1 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.5,
    color: AppColors.text,
  );

  static const TextStyle h2 = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.5,
    color: AppColors.text,
  );

  static const TextStyle h3 = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: AppColors.text,
  );

  static const TextStyle body = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: AppColors.textSecondary,
    height: 1.57,
  );

  static const TextStyle bodySmall = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w400,
    color: AppColors.textSecondary,
  );

  static const TextStyle label = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w600,
    color: AppColors.textSecondary,
    letterSpacing: 0.5,
  );

  static const TextStyle button = TextStyle(
    fontSize: 15,
    fontWeight: FontWeight.w600,
    color: AppColors.white,
    letterSpacing: 0.5,
  );
}
