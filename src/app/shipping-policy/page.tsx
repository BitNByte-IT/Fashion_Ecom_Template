import type { Metadata } from "next";
import { brand, shipping } from "@/config/store.config";

export const metadata: Metadata = { title: `Shipping Policy — ${brand.name}` };

export default function ShippingPolicyPage() {
  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="section-title mb-2">Shipping <span>Policy</span></h1>
      <div className="section-divider mb-8" />
      <div className="prose prose-sm space-y-5 text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--color-foreground)" }}>Delivery Timeframe</h2>
          <p>Inside Dhaka: <strong style={{ color: "var(--color-foreground)" }}>{shipping.estimatedDelivery.insideCity}</strong></p>
          <p>Outside Dhaka: <strong style={{ color: "var(--color-foreground)" }}>{shipping.estimatedDelivery.outsideCity}</strong></p>
        </section>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--color-foreground)" }}>Shipping Charges</h2>
          <p>Inside city (Dhaka): <strong style={{ color: "var(--color-foreground)" }}>৳{shipping.insideCity}</strong></p>
          <p>Outside Dhaka: <strong style={{ color: "var(--color-foreground)" }}>৳{shipping.outsideCity}</strong></p>
          {shipping.freeShippingThreshold > 0 && (
            <p>Free shipping on orders above <strong style={{ color: "var(--color-primary)" }}>৳{shipping.freeShippingThreshold.toLocaleString()}</strong></p>
          )}
        </section>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--color-foreground)" }}>Payment</h2>
          <p>We currently offer Cash on Delivery (COD) only. Please have the exact amount ready upon delivery.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--color-foreground)" }}>Order Confirmation</h2>
          <p>After placing your order, our team will call you within 24 hours to confirm. Please keep your phone accessible.</p>
        </section>
      </div>
    </div>
  );
}
