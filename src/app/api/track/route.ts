import { NextRequest, NextResponse } from "next/server";
import { sheets } from "@/config/store.config";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const orderId = searchParams.get("orderId")?.trim();
  const phone   = searchParams.get("phone")?.trim();

  if (!orderId && !phone) {
    return NextResponse.json({ found: false, error: "Provide orderId or phone" }, { status: 400 });
  }

  // Normalize phone: strip non-digits and leading zeros so "01407521342" == "1407521342"
  const normalizedPhone = phone ? phone.replace(/\D/g, "").replace(/^0+/, "") : undefined;

  const scriptUrl = sheets.ordersScriptUrl;
  if (!scriptUrl || scriptUrl.includes("YOUR_SCRIPT_ID")) {
    return NextResponse.json(
      { found: false, error: "Order tracking is not set up yet." },
      { status: 503 }
    );
  }

  try {
    const params = new URLSearchParams();
    if (orderId) params.set("orderId", orderId);
    else if (normalizedPhone) params.set("phone", normalizedPhone);

    const res  = await fetch(`${scriptUrl}?${params.toString()}`, {
      signal: AbortSignal.timeout(12000), // 12s — Apps Script can be slow on cold start
    });
    const text = await res.text();

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(text);
    } catch {
      // Apps Script occasionally returns an HTML error page instead of JSON
      console.error("[track] Apps Script returned non-JSON:", text.slice(0, 200));
      return NextResponse.json(
        { found: false, error: "Tracking service is temporarily unavailable. Please try again in a moment." },
      );
    }

    // Normalize: old script returns { order: {} }, new script returns { orders: [] }
    const orders = (data.orders as unknown[]) ?? (data.order ? [data.order] : []);
    return NextResponse.json({ found: data.found ?? false, orders, error: data.error });
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    return NextResponse.json(
      { found: false, error: isTimeout
          ? "Tracking service took too long to respond. Please try again."
          : "Could not reach tracking service. Please try again." },
    );
  }
}
