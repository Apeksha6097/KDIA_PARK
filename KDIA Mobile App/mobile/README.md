# KDIA Portal Mobile App

React Native (Expo) mobile application for the KDIA Portal Customer Portal.

## 🚧 Demo Mode Only

**IMPORTANT:** This mobile app currently runs in **demo-only mode**. It does not connect to the real backend API and uses mock data for demonstration purposes.

### What This Means:
- ✅ Any login credentials will be accepted
- ✅ All data displayed is simulated/mock data
- ✅ No real API calls are made to the backend
- ✅ Perfect for testing UI/UX and app flow
- ❌ Not suitable for production use without backend integration

## 📱 Project Overview

This is a customer-facing mobile application for the KDIA (Kerala Distributed Independent Aggregator) Portal. It allows customers to:
- Login with demo credentials
- View their energy allocation details
- Check subscription and consumption data
- Monitor allocation status

## 🛠️ Prerequisites

Before running this app, ensure you have:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (optional, but recommended)
- **Expo Go** app on your mobile device (for testing)

## 📦 Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

## 🚀 Running the App

### Start the Development Server
```bash
npm start
```

This will start the Expo development server and display a QR code in your terminal.

### Run on Android
```bash
npm run android
```

### Run on iOS (macOS only)
```bash
npm run ios
```

### Run on Web
```bash
npm run web
```

## 📱 Testing with Expo Go

1. Install the **Expo Go** app on your mobile device:
   - [Android - Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Start the development server with `npm start`

3. Scan the QR code:
   - **Android**: Use the Expo Go app to scan the QR code
   - **iOS**: Use the Camera app to scan the QR code, then open in Expo Go

## 🎯 Demo Login

Since the app is in demo mode, you can login with **any credentials**:

**Example Credentials:**
- Email: `customer@example.com`
- Password: `anything`

**Role-based demo users:**
- Customer: Use any email (e.g., `customer@test.com`)
- Admin: Use email containing "admin" (e.g., `admin@test.com`)
- Vendor: Use email containing "vendor" (e.g., `vendor@test.com`)

> **Note:** Currently only the customer role has dashboard functionality.

## 🏗️ Project Structure

```
/mobile
├── screens/           # Screen components
│   ├── LoginScreen.tsx
│   └── DashboardScreen.tsx
├── navigation/        # Navigation configuration
│   └── AppNavigator.tsx
├── services/          # API services (demo mode)
│   └── api.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── components/       # Reusable components (currently empty)
├── App.tsx           # Main app entry point
└── package.json      # Dependencies and scripts
```

## 🔌 Backend Connectivity

The app is configured to connect to:
```
https://kdia-portal.vercel.app/api
```

However, **all API calls are currently mocked** in the `services/api.ts` file for demo purposes.

### To Enable Real API Calls:
1. Update `/mobile/services/api.ts`
2. Replace the mock functions with real `fetch` calls to the API
3. Handle authentication tokens properly
4. Add error handling for network failures

## 🔐 Data Storage

The app uses `AsyncStorage` to store:
- User authentication data
- JWT tokens (demo tokens only)

Data is cleared when the user logs out.

## ⚠️ Safety Notes

- **No modifications** have been made to `/client` (web frontend)
- **No modifications** have been made to `/api` (backend)
- All mobile app code is isolated in the `/mobile` directory
- The app is completely reversible and can be removed without affecting the web application

## 🎨 Styling Approach

The app uses **React Native StyleSheet** for styling with:
- Simple, clean design
- KDIA brand colors (teal/green primary)
- Minimal complexity as per requirements
- Responsive layouts

## 📝 TypeScript

The project is built with **TypeScript** for type safety. All type definitions are in `/mobile/types/index.ts`.

## 🐛 Troubleshooting

### Metro bundler issues
```bash
# Clear cache and restart
npx expo start -c
```

### Dependency issues
```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Android build errors
Make sure you have Android Studio installed and configured, or use Expo Go for testing.

## 📄 License

This is part of the KDIA Portal project. See the main project README for license information.

## 🤝 Contributing

This mobile app is an extension of the KDIA Portal. Any changes should:
1. Not modify existing `/client` or `/api` code
2. Follow the demo-only mode pattern
3. Maintain TypeScript type safety
4. Be documented in this README

---

**Built with ❤️ for KDIA Portal**
