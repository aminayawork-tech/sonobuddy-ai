#!/usr/bin/env node
/**
 * Run after `npx cap add ios` and `npx cap add android` on your Mac.
 * Patches Info.plist and AndroidManifest.xml, then generates icons.
 *
 * Usage:  npm run native:setup
 */

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');

// ── iOS Info.plist ────────────────────────────────────────────────────────────

const plistPath = path.join(root, 'ios', 'App', 'App', 'Info.plist');

// Each entry: [key, value-xml]
const iosEntries = [
  // Camera & photo library
  ['NSCameraUsageDescription',
   '<string>SonoBuddy AI uses your camera to photograph ultrasound screens for AI analysis.</string>'],
  ['NSPhotoLibraryUsageDescription',
   '<string>SonoBuddy AI accesses your photo library to select saved ultrasound images for analysis.</string>'],
  ['NSPhotoLibraryAddUsageDescription',
   '<string>SonoBuddy AI saves annotated scan results to your photo library.</string>'],
  // Export compliance — we use HTTPS only, no custom crypto
  ['ITSAppUsesNonExemptEncryption',
   '<false/>'],
  // Restrict WebView navigation to our domain (pairs with limitsNavigationsToAppBoundDomains)
  ['WKAppBoundDomains',
   '<array>\n\t\t<string>sonobuddyai.app</string>\n\t</array>'],
  // Prevent accidental phone/FaceTime link interception
  ['LSApplicationQueriesSchemes',
   '<array>\n\t\t<string>mailto</string>\n\t</array>'],
];

if (fs.existsSync(plistPath)) {
  let plist = fs.readFileSync(plistPath, 'utf8');
  let changed = false;

  for (const [key, valueXml] of iosEntries) {
    if (!plist.includes(`<key>${key}</key>`)) {
      plist = plist.replace(
        '</dict>\n</plist>',
        `\t<key>${key}</key>\n\t${valueXml}\n</dict>\n</plist>`
      );
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(plistPath, plist, 'utf8');
    console.log('✓ iOS Info.plist patched');
  } else {
    console.log('✓ iOS Info.plist already up to date');
  }
} else {
  console.log('⚠  ios/ not found — run: npx cap add ios');
}

// ── AndroidManifest.xml ───────────────────────────────────────────────────────

const manifestPath = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');

const androidPermissions = [
  'android.permission.CAMERA',
  'android.permission.READ_MEDIA_IMAGES',
  'android.permission.INTERNET',
  'android.permission.ACCESS_NETWORK_STATE',
];

if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf8');
  let changed = false;

  for (const perm of androidPermissions) {
    if (!manifest.includes(perm)) {
      manifest = manifest.replace(
        '<application',
        `<uses-permission android:name="${perm}" />\n\n    <application`
      );
      changed = true;
    }
  }

  if (!manifest.includes('android.hardware.camera')) {
    manifest = manifest.replace(
      '<application',
      `<uses-feature android:name="android.hardware.camera" android:required="false" />\n\n    <application`
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(manifestPath, manifest, 'utf8');
    console.log('✓ AndroidManifest.xml patched');
  } else {
    console.log('✓ AndroidManifest.xml already up to date');
  }
} else {
  console.log('⚠  android/ not found — run: npx cap add android');
}

// ── Generate icons ────────────────────────────────────────────────────────────

const assetsDir = path.join(root, 'assets');
const hasIcons  = fs.existsSync(path.join(assetsDir, 'icon-only.png'));
const hasSplash = fs.existsSync(path.join(assetsDir, 'splash.png'));

if (hasIcons && hasSplash) {
  try {
    console.log('Generating icons for all platforms…');
    execSync('npx @capacitor/assets generate', { cwd: root, stdio: 'inherit' });
    console.log('✓ Icons generated');
  } catch {
    console.log('⚠  Icon generation failed — run manually: npx @capacitor/assets generate');
  }
} else {
  console.log('⚠  assets/icon-only.png or assets/splash.png missing — run: npm run icons:generate');
}

// ── Sync ─────────────────────────────────────────────────────────────────────

try {
  console.log('Syncing Capacitor…');
  execSync('npx cap sync', { cwd: root, stdio: 'inherit' });
  console.log('✓ Cap sync complete');
} catch {
  console.log('⚠  cap sync failed — run manually: npx cap sync');
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Setup complete. Next steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 iOS (Mac required):
   npm run cap:ios
   → In Xcode: set your Team under Signing & Capabilities
   → Product → Archive → Distribute App → App Store Connect

 Android:
   npm run cap:android
   → In Android Studio: Build → Generate Signed Bundle
   → Upload .aab to Google Play Console

 App Store Connect checklist:
   app-store-copy.txt  — description, keywords, subtitle ready to paste
   assets/icon-only.png — 1024×1024 for App Store listing icon
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
