import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Called by the iOS app after a successful StoreKit transaction.
// payload format: "transactionId|productId"
export async function POST(req: NextRequest) {
  try {
    const { payload } = await req.json() as { payload: string };
    if (!payload) return NextResponse.json({ error: "Missing payload" }, { status: 400 });

    const [, productId] = payload.split("|");
    const tier = productId?.includes("pro") ? "pro" : "free";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await supabase.from("profiles").update({ tier }).eq("id", user.id);

    return NextResponse.json({ success: true, tier });
  } catch (err) {
    console.error("iOS purchase error:", err);
    return NextResponse.json({ error: "Purchase sync failed" }, { status: 500 });
  }
}
