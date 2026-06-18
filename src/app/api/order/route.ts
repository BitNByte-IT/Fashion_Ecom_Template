import { NextRequest, NextResponse } from "next/server";
import { sheets } from "@/config/store.config";

export async function POST(req: NextRequest) {
  // Skip silently in dev (script URL not configured yet)
  if (!sheets.ordersScriptUrl || sheets.ordersScriptUrl.includes("YOUR_SCRIPT_ID")) {
    return NextResponse.json({ success: true, dev: true });
  }

  try {
    const body = await req.json();
    const res = await fetch(sheets.ordersScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      return NextResponse.json({ success: true });
    }
  } catch {
    // Don't surface sheet errors to the customer — order is placed regardless
    return NextResponse.json({ success: false, error: "Sheet write failed" }, { status: 200 });
  }
}
