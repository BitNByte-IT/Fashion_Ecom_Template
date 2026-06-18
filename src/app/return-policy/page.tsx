import type { Metadata } from "next";
import { brand, contact } from "@/config/store.config";

export const metadata: Metadata = { title: `Return Policy — ${brand.name}` };

export default function ReturnPolicyPage() {
  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="section-title mb-2">Return <span>Policy</span></h1>
      <div className="section-divider mb-8" />
      <div className="space-y-5 text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--color-foreground)" }}>7-Day Return Window</h2>
          <p>We accept returns within 7 days of delivery for items that are unworn, unwashed, and in their original condition with tags attached.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--color-foreground)" }}>How to Return</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>Contact us via phone or WhatsApp with your order ID.</li>
            <li>Our team will guide you through the return process.</li>
            <li>Ship the item back or arrange a pickup.</li>
            <li>Refund or exchange will be processed within 3 business days of receiving the item.</li>
          </ol>
        </section>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--color-foreground)" }}>Non-returnable Items</h2>
          <p>Sale items, innerwear, and accessories are non-returnable.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--color-foreground)" }}>Contact for Returns</h2>
          <p>Phone: <a href={`tel:${contact.phone}`} className="hover:text-[var(--color-primary)]" style={{ color: "var(--color-foreground)" }}>{contact.phone}</a></p>
          <p>Email: <a href={`mailto:${contact.email}`} className="hover:text-[var(--color-primary)]" style={{ color: "var(--color-foreground)" }}>{contact.email}</a></p>
        </section>
      </div>
    </div>
  );
}
