"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cart.store";
import { buildOrder, placeOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { shipping } from "@/config/store.config";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  district: string;
  division: string;
  notes: string;
}

const EMPTY_FORM: FormData = {
  name: "", phone: "", email: "",
  address: "", area: "", district: "",
  division: "", notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const sub = subtotal();
  const shippingCost =
    sub >= shipping.freeShippingThreshold && shipping.freeShippingThreshold > 0
      ? 0
      : form.division === "Dhaka"
      ? shipping.insideCity
      : shipping.outsideCity;

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setLoading(true);
    try {
      const order = buildOrder(
        { name: form.name, phone: form.phone, email: form.email },
        { address: form.address, area: form.area, district: form.district, division: form.division },
        items,
        shippingCost,
        form.notes || undefined
      );
      await placeOrder(order);
      clearCart();
      router.push(`/order-success?id=${order.id}&name=${encodeURIComponent(form.name)}&total=${order.total}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <p style={{ color: "var(--color-muted)" }}>Your cart is empty.</p>
        <a href="/shop" className="btn-primary mt-4 inline-block">
          Shop Now
        </a>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="section-title mb-2">
        Checkout
      </h1>
      <div className="section-divider mb-8" />

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left — form */}
          <div className="flex-1 space-y-8">
            {/* Customer info */}
            <section>
              <h2
                className="text-xs font-semibold tracking-widest uppercase mb-5 pb-2 border-b"
                style={{ color: "var(--color-foreground)", borderColor: "var(--color-border)" }}
              >
                Customer Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input className="input" value={form.name} onChange={set("name")} required placeholder="Fatima Rahman" />
                </div>
                <div>
                  <label className="label">Phone Number *</label>
                  <input className="input" type="tel" value={form.phone} onChange={set("phone")} required placeholder="01XXXXXXXXX" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Email Address</label>
                  <input className="input" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
                </div>
              </div>
            </section>

            {/* Delivery address */}
            <section>
              <h2
                className="text-xs font-semibold tracking-widest uppercase mb-5 pb-2 border-b"
                style={{ color: "var(--color-foreground)", borderColor: "var(--color-border)" }}
              >
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Division *</label>
                  <select className="select" value={form.division} onChange={set("division")} required>
                    <option value="">Select Division</option>
                    {shipping.divisions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">District *</label>
                  <input className="input" value={form.district} onChange={set("district")} required placeholder="e.g. Dhaka" />
                </div>
                <div>
                  <label className="label">Area / Thana *</label>
                  <input className="input" value={form.area} onChange={set("area")} required placeholder="e.g. Dhanmondi" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Full Address *</label>
                  <input className="input" value={form.address} onChange={set("address")} required placeholder="House no, Road no, Building name" />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2
                className="text-xs font-semibold tracking-widest uppercase mb-5 pb-2 border-b"
                style={{ color: "var(--color-foreground)", borderColor: "var(--color-border)" }}
              >
                Payment Method
              </h2>
              <div
                className="flex items-center gap-3 border p-4"
                style={{ borderColor: "var(--color-primary)", backgroundColor: "var(--color-surface)" }}
              >
                <div
                  className="w-4 h-4 rounded-full border-4 flex-shrink-0"
                  style={{ borderColor: "var(--color-primary)" }}
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                    Cash on Delivery
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                    Pay when your order arrives. No upfront payment needed.
                  </p>
                </div>
              </div>
            </section>

            {/* Notes */}
            <section>
              <label className="label">Order Notes (optional)</label>
              <textarea
                className="input"
                rows={3}
                value={form.notes}
                onChange={set("notes")}
                placeholder="Any special instructions for your order..."
                style={{ resize: "vertical" }}
              />
            </section>
          </div>

          {/* Right — order summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div
              className="border p-6 space-y-4 sticky top-24"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
            >
              <h2
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "var(--color-foreground)" }}
              >
                Order Summary
              </h2>

              {/* Items */}
              <ul className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <li
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex gap-3"
                  >
                    <div
                      className="relative w-14 h-16 flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: "var(--color-background)" }}
                    >
                      <Image
                        src={item.product.images[0] || "/images/products/placeholder.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      <span
                        className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded-full"
                        style={{ backgroundColor: "var(--color-primary)", color: "var(--color-background)" }}
                      >
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "var(--color-foreground)" }}>
                        {item.product.name}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--color-muted)" }}>
                        {item.selectedSize} / {item.selectedColor}
                      </p>
                    </div>
                    <p className="text-xs font-semibold flex-shrink-0" style={{ color: "var(--color-primary)" }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <div
                className="border-t pt-3 space-y-2"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--color-muted)" }}>Subtotal</span>
                  <span style={{ color: "var(--color-foreground)" }}>{formatPrice(sub)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--color-muted)" }}>Shipping</span>
                  <span style={{ color: shippingCost === 0 ? "var(--color-success)" : "var(--color-foreground)" }}>
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
              </div>

              <div
                className="flex justify-between items-center pt-2 border-t font-semibold"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span style={{ color: "var(--color-foreground)" }}>Total</span>
                <span style={{ color: "var(--color-primary)" }}>{formatPrice(sub + shippingCost)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center mt-2"
              >
                {loading ? "Placing Order..." : "Place Order — COD"}
              </button>

              <p className="text-[10px] text-center" style={{ color: "var(--color-muted)" }}>
                By placing your order, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
