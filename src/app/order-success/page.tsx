import Link from "next/link";
import { CheckCircle, Package, Phone, Mail } from "lucide-react";
import { contact, shipping, brand } from "@/config/store.config";

interface Props {
  searchParams: Promise<{ id?: string; name?: string; total?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = params.id || "N/A";
  const customerName = params.name || "Customer";
  const total = params.total ? `৳${parseInt(params.total).toLocaleString()}` : "";

  return (
    <div className="container py-16 max-w-2xl">
      {/* Success icon */}
      <div className="flex flex-col items-center text-center mb-10">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <CheckCircle size={44} style={{ color: "var(--color-success)" }} />
        </div>
        <h1 className="text-2xl md:text-3xl font-light tracking-wide" style={{ color: "var(--color-foreground)" }}>
          Order Placed!
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>
          Thank you, <strong style={{ color: "var(--color-foreground)" }}>{customerName}</strong>! Your order has been received.
        </p>
      </div>

      {/* Order info card */}
      <div
        className="border p-6 mb-8 space-y-4"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <div className="flex justify-between items-center">
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--color-muted)" }}>
            Order ID
          </span>
          <span className="text-sm font-mono font-medium" style={{ color: "var(--color-primary)" }}>
            {orderId}
          </span>
        </div>
        {total && (
          <div className="flex justify-between items-center border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
            <span className="text-xs tracking-widest uppercase" style={{ color: "var(--color-muted)" }}>
              Total Amount
            </span>
            <span className="text-base font-semibold" style={{ color: "var(--color-foreground)" }}>
              {total}
            </span>
          </div>
        )}
        <div
          className="border-t pt-3 flex items-start gap-3"
          style={{ borderColor: "var(--color-border)" }}
        >
          <Package size={18} className="flex-shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
              Cash on Delivery
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
              Please have the exact amount ready upon delivery.
              Estimated: {shipping.estimatedDelivery.outsideCity}
            </p>
          </div>
        </div>
      </div>

      {/* What's next */}
      <div className="mb-8">
        <h2
          className="text-xs font-semibold tracking-widest uppercase mb-4"
          style={{ color: "var(--color-foreground)" }}
        >
          What happens next?
        </h2>
        <ol className="space-y-3">
          {[
            "We'll confirm your order via phone within 24 hours.",
            "Your order will be packed and dispatched.",
            "Our delivery partner will contact you before delivery.",
            "Receive your order and pay the total amount.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--color-background)" }}
              >
                {i + 1}
              </span>
              <span style={{ color: "var(--color-muted)" }}>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Contact */}
      <div
        className="border p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <a
          href={`tel:${contact.phone}`}
          className="flex items-center gap-3 text-sm transition-colors hover:text-[var(--color-primary)]"
          style={{ color: "var(--color-muted)" }}
        >
          <Phone size={16} style={{ color: "var(--color-primary)" }} />
          {contact.phone}
        </a>
        <a
          href={`mailto:${contact.email}`}
          className="flex items-center gap-3 text-sm transition-colors hover:text-[var(--color-primary)]"
          style={{ color: "var(--color-muted)" }}
        >
          <Mail size={16} style={{ color: "var(--color-primary)" }} />
          {contact.email}
        </a>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/shop" className="btn-primary flex-1 justify-center">
          Continue Shopping
        </Link>
        <Link
          href={`/track-order?orderId=${encodeURIComponent(orderId)}`}
          className="btn-outline flex-1 justify-center"
        >
          Track My Order
        </Link>
      </div>
    </div>
  );
}
