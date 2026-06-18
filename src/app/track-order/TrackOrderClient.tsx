"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Package, CheckCircle, Truck, Home, AlertCircle, ChevronRight, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderSummary {
  orderId:      string;
  date:         string;
  customerName: string;
  phone:        string;
  division:     string;
  district:     string;
  area:         string;
  address:      string;
  items:        string;
  subtotal:     number | string;
  shipping:     number | string;
  total:        number | string;
  payment:      string;
  notes:        string;
  status:       string;
}

// ─── Date formatting ─────────────────────────────────────────────────────────
// Stored format from Apps Script: "18/06/2026, 20:44:55" (en-GB / DD/MM/YYYY)
function formatOrderDate(raw: string): string {
  if (!raw) return "—";
  try {
    // Match DD/MM/YYYY, HH:MM:SS
    const m = String(raw).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s*(\d{1,2}):(\d{2})/);
    if (m) {
      const date = new Date(
        Number(m[3]), Number(m[2]) - 1, Number(m[1]),
        Number(m[4]), Number(m[5])
      );
      return date.toLocaleString("en-GB", {
        day:    "numeric",
        month:  "short",
        year:   "numeric",
        hour:   "2-digit",
        minute: "2-digit",
        hour12: true,
      }).replace(",", " ·");  // "18 Jun 2026 · 08:44 pm"
    }
  } catch { /* fall through */ }
  return String(raw); // unknown format — show as-is
}

// ─── Status config ────────────────────────────────────────────────────────────

const STEPS = [
  { key: "Pending",   label: "Order Placed", Icon: Package },
  { key: "Confirmed", label: "Confirmed",    Icon: CheckCircle },
  { key: "Shipped",   label: "Shipped",      Icon: Truck },
  { key: "Delivered", label: "Delivered",    Icon: Home },
] as const;

const STATUS_RANK: Record<string, number> = {
  Pending: 0, Confirmed: 1, Shipped: 2, Delivered: 3,
};

function statusColor(status: string) {
  if (status === "Delivered") return "var(--color-success)";
  if (status === "Cancelled") return "var(--color-danger)";
  if (status === "Shipped" || status === "Confirmed") return "var(--color-primary)";
  return "var(--color-muted)";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusTimeline({ status }: { status: string }) {
  const stepIndex = STATUS_RANK[status] ?? 0;
  return (
    <div className="flex items-start">
      {STEPS.map(({ key, label, Icon }, i) => {
        const done = i <= stepIndex;
        return (
          <Fragment key={key}>
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: done ? "var(--color-primary)" : "var(--color-background)",
                  border: `2px solid ${done ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              >
                <Icon size={16} style={{ color: done ? "var(--color-background)" : "var(--color-muted)" }} />
              </div>
              <p
                className="text-[10px] font-semibold tracking-wide uppercase text-center w-16 leading-tight"
                style={{ color: done ? "var(--color-primary)" : "var(--color-muted)" }}
              >
                {label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-px mt-5 mx-1"
                style={{ backgroundColor: i < stepIndex ? "var(--color-primary)" : "var(--color-border)" }}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

function OrderDetail({ order, onBack }: { order: OrderSummary; onBack?: () => void }) {
  const cancelled = order.status === "Cancelled";

  return (
    <div className="space-y-5">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--color-primary)]"
          style={{ color: "var(--color-muted)" }}
        >
          <ArrowLeft size={15} />
          Back to all orders
        </button>
      )}

      {/* Cancelled banner */}
      {cancelled && (
        <div
          className="text-center py-4 border text-sm font-medium tracking-wide uppercase"
          style={{ borderColor: "var(--color-danger)", color: "var(--color-danger)" }}
        >
          This order has been cancelled
        </div>
      )}

      {/* Status timeline */}
      {!cancelled && (
        <div
          className="border p-6"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--color-foreground)" }}>
            Delivery Progress
          </p>
          <StatusTimeline status={order.status} />
          <p className="text-xs mt-5" style={{ color: "var(--color-muted)" }}>
            Current status:{" "}
            <strong style={{ color: "var(--color-primary)" }}>{order.status}</strong>
          </p>
        </div>
      )}

      {/* Order info */}
      <div
        className="border p-6"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase pb-4 mb-4 border-b" style={{ color: "var(--color-foreground)", borderColor: "var(--color-border)" }}>
          Order Details
        </p>
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--color-muted)" }}>Order ID</p>
            <p className="font-mono font-medium" style={{ color: "var(--color-primary)" }}>{order.orderId}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--color-muted)" }}>Date</p>
            <p style={{ color: "var(--color-foreground)" }}>{formatOrderDate(order.date)}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--color-muted)" }}>Customer</p>
            <p style={{ color: "var(--color-foreground)" }}>{order.customerName}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--color-muted)" }}>Phone</p>
            <p style={{ color: "var(--color-foreground)" }}>{order.phone}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--color-muted)" }}>Delivery Address</p>
            <p style={{ color: "var(--color-foreground)" }}>
              {[order.address, order.area, order.district, order.division].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Items + totals */}
      <div
        className="border p-6"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase pb-4 mb-4 border-b" style={{ color: "var(--color-foreground)", borderColor: "var(--color-border)" }}>
          Items Ordered
        </p>
        <ul className="space-y-2 mb-5">
          {String(order.items).split(";").map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span style={{ color: "var(--color-primary)" }}>—</span>
              <span style={{ color: "var(--color-muted)" }}>{item.trim()}</span>
            </li>
          ))}
        </ul>
        <div className="border-t pt-4 space-y-2" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex justify-between text-sm">
            <span style={{ color: "var(--color-muted)" }}>Subtotal</span>
            <span style={{ color: "var(--color-foreground)" }}>{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "var(--color-muted)" }}>Shipping</span>
            <span style={{ color: "var(--color-foreground)" }}>
              {Number(order.shipping) === 0 ? "Free" : formatPrice(Number(order.shipping))}
            </span>
          </div>
          <div className="flex justify-between text-sm font-semibold pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
            <span style={{ color: "var(--color-foreground)" }}>Total (COD)</span>
            <span style={{ color: "var(--color-primary)" }}>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link href="/shop" className="btn-primary flex-1 justify-center">
          Continue Shopping
        </Link>
        {!onBack && (
          <button
            onClick={() => window.location.reload()}
            className="btn-outline flex-1 justify-center"
          >
            Track Another Order
          </button>
        )}
      </div>
    </div>
  );
}

function OrderList({ orders, onSelect, onReset }: {
  orders: OrderSummary[];
  onSelect: (o: OrderSummary) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Found{" "}
          <strong style={{ color: "var(--color-foreground)" }}>{orders.length} orders</strong>
          {" "}for this phone number
        </p>
        <button
          onClick={onReset}
          className="text-xs flex items-center gap-1 transition-colors hover:text-[var(--color-primary)]"
          style={{ color: "var(--color-muted)" }}
        >
          <ArrowLeft size={12} /> New search
        </button>
      </div>

      {orders.map((order) => (
        <button
          key={order.orderId}
          onClick={() => onSelect(order)}
          className="w-full text-left border transition-colors hover:border-[var(--color-primary)]"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
        >
          <div className="flex items-center justify-between p-5 gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                <span className="text-sm font-mono font-medium" style={{ color: "var(--color-primary)" }}>
                  {order.orderId}
                </span>
                <span
                  className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5"
                  style={{ color: statusColor(order.status), border: `1px solid ${statusColor(order.status)}` }}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs truncate" style={{ color: "var(--color-muted)" }}>
                {formatOrderDate(order.date)}
              </p>
              <p className="text-xs mt-1 truncate" style={{ color: "var(--color-muted)" }}>
                {String(order.items).split(";")[0].trim()}
                {String(order.items).split(";").length > 1 && ` +${String(order.items).split(";").length - 1} more`}
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-3">
              <span className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
                {formatPrice(Number(order.total))}
              </span>
              <ChevronRight size={16} style={{ color: "var(--color-muted)" }} />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TrackOrderClient() {
  const searchParams = useSearchParams();

  const [tab,      setTab]      = useState<"id" | "phone">("id");
  const [query,    setQuery]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [orders,   setOrders]   = useState<OrderSummary[]>([]);
  const [selected, setSelected] = useState<OrderSummary | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (id) setQuery(id);
  }, [searchParams]);

  const reset = () => {
    setOrders([]);
    setSelected(null);
    setError(null);
    setQuery("");
  };

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setOrders([]);
    setSelected(null);

    try {
      const params = new URLSearchParams();
      if (tab === "id") params.set("orderId", query.trim());
      else              params.set("phone",   query.trim());

      const res  = await fetch(`/api/track?${params}`);
      const data = await res.json();

      if (data.found && data.orders?.length > 0) {
        if (data.orders.length === 1) {
          setSelected(data.orders[0]);   // single result → go straight to detail
        } else {
          setOrders(data.orders);         // multiple → show list
        }
      } else {
        setError(data.error || "Order not found. Please check and try again.");
      }
    } catch {
      setError("Unable to reach tracking service. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const showSearch = !selected && orders.length === 0;

  return (
    <div className="container py-12 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "var(--color-primary)" }}>
          Delivery Status
        </p>
        <h1 className="text-2xl md:text-3xl font-light tracking-wide" style={{ color: "var(--color-foreground)" }}>
          Track Your Order
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--color-muted)" }}>
          Enter your Order ID or phone number to check delivery status
        </p>
      </div>

      {/* Search form — always visible unless showing detail */}
      {(showSearch || orders.length > 0) && !selected && (
        <div
          className="border p-6 mb-8"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
        >
          <div className="flex border-b mb-5" style={{ borderColor: "var(--color-border)" }}>
            {(["id", "phone"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); reset(); }}
                className="pb-3 px-4 text-xs font-semibold tracking-widest uppercase transition-colors"
                style={{
                  color:        tab === t ? "var(--color-primary)" : "var(--color-muted)",
                  borderBottom: tab === t ? "2px solid var(--color-primary)" : "2px solid transparent",
                }}
              >
                {t === "id" ? "Order ID" : "Phone Number"}
              </button>
            ))}
          </div>

          <form onSubmit={search} className="flex gap-3">
            <input
              className="input flex-1"
              placeholder={tab === "id" ? "e.g. BB-ABC123-XY9Z" : "e.g. 01XXXXXXXXX"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" disabled={loading} className="btn-primary gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Searching</span>
                </>
              ) : (
                <>
                  <Search size={15} />
                  <span className="hidden sm:inline">Track</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-3 border px-5 py-4 text-sm mb-6"
          style={{ borderColor: "var(--color-danger)", color: "var(--color-danger)" }}
        >
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Multiple results — order list */}
      {orders.length > 1 && !selected && (
        <OrderList
          orders={orders}
          onSelect={setSelected}
          onReset={reset}
        />
      )}

      {/* Single result or selected from list — detail view */}
      {selected && (
        <OrderDetail
          order={selected}
          onBack={orders.length > 1 ? () => setSelected(null) : undefined}
        />
      )}
    </div>
  );
}
