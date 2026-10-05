import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.sonobuddy.ai',
  appName: 'SonoBuddy AI',
  webDir: 'public',
  server: {
    // Production Vercel deployment — all API routes and auth stay server-side.
    // Subscriptions are sold exclusively via Apple In-App Purchase (RevenueCat).
    url: 'https://sonobuddyai.app',
    cleartext: false,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    StatusBar: {
      style: 'DEFAULT',
      backgroundColor: '#ffffff',
    },
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#ffffff',
    allowsLinkPreview: false,
    scrollEnabled: true,
    // Restricts WebView navigation to sonobuddyai.app only — required for limitsNavigationsToAppBoundDomains
    limitsNavigationsToAppBoundDomains: true,
  },
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: false,
    captureInput: true,
  },
};

export default config;
