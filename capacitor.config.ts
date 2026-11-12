import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.sonobuddy.ai',
  appName: 'SonoBuddy AI',
  webDir: 'public',
  server: {
    // Production Vercel deployment — all API routes and auth stay server-side.
    // Subscriptions are sold exclusively via Apple In-App Purchase (StoreKit).
    url: 'https://www.sonobuddyai.com',
    cleartext: false,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#eef3f8',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#ffffff',
    allowsLinkPreview: false,
    scrollEnabled: true,
    // Restricts WebView navigation to www.sonobuddyai.com only — required for limitsNavigationsToAppBoundDomains
    limitsNavigationsToAppBoundDomains: true,
  },
  android: {
    backgroundColor: '#eef3f8',
    // Lets the web app detect the Android shell (e.g. to hide iOS-only purchases).
    appendUserAgent: 'SonoBuddyAI-Android',
    allowMixedContent: false,
    captureInput: true,
  },
};

export default config;
