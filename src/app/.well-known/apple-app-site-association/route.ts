import { NextResponse } from "next/server";

// Universal Links: lets the iOS app open sign-in links from emails
// (confirm email, password reset) instead of Safari. Apple fetches this file
// when the app is installed. APPLE_TEAM_ID is the 10-character Team ID from
// developer.apple.com → Membership.
const BUNDLE_ID = "app.sonobuddy.ai";

export function GET() {
  const teamId = process.env.APPLE_TEAM_ID;
  if (!teamId) return new NextResponse("Not configured", { status: 404 });
  const appId = `${teamId}.${BUNDLE_ID}`;
  return NextResponse.json({
    applinks: {
      details: [{ appIDs: [appId], components: [{ "/": "/auth/*", comment: "Email confirmation and password reset links" }] }],
    },
    webcredentials: { apps: [appId] },
  });
}
