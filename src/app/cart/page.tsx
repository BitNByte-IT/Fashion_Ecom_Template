"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";
import { shipping } from "@/config/store.config";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();
  const sub = subtotal();
  const shippingCost =
    sub >= shipping.freeShippingThreshold && shipping.freeShippingThreshold > 0
      ? 0
      : shipping.outsideCity;

  if (items.length === 0) {
    return (
      <div className="container py-20 flex flex-col items-center gap-5">
        <ShoppingBag size={56} style={{ color: "var(--color-border)" }} />
        <h1 className="section-title">Your Cart is Empty</h1>
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/shop" className="btn-primary mt-2">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="section-title mb-2">
        Your <span>Cart</span>
      </h1>
      <div className="section-divider mb-8" />

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Items */}
        <div className="flex-1">
          <div
            className="hidden md:grid grid-cols-12 text-xs tracking-widest uppercase pb-3 border-b mb-2"
            style={{ color: "var(--color-muted)", borderColor: "var(--color-border)" }}
          >
            <span className="col-span-6">Product</span>
            <span className="col-span-2 text-center">Price</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          <ul className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {items.map((item) => (
              <li
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="py-5 grid grid-cols-12 gap-4 items-center"
              >
                {/* Image + name */}
                <div className="col-span-12 md:col-span-6 flex gap-4">
                  <div
                    className="relative w-20 h-24 flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: "var(--color-surface)" }}
                  >
                    <Image
                      src={item.product.images[0] || "/images/products/placeholder.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/shop/${item.product.slug}`}
                      className="text-sm font-medium hover:text-[var(--color-primary)] transition-colors"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                      Size: {item.selectedSize} · Color: {item.selectedColor}
                    </p>
                    <button
                      onClick={() =>
                        removeItem(item.product.id, item.selectedSize, item.selectedColor)
                      }
                      className="flex items-center gap-1 text-xs mt-2 transition-colors hover:text-red-400"
                      style={{ color: "var(--color-muted)" }}
                    >
                      <Trash2 size={11} />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-4 md:col-span-2 text-sm md:text-center" style={{ color: "var(--color-foreground)" }}>
                  {formatPrice(item.product.price)}
                </div>

                {/* Qty */}
                <div className="col-span-4 md:col-span-2 flex items-center justify-center">
                  <div
                    className="flex items-center border"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <button
                      className="w-8 h-8 flex items-center justify-center text-sm"
                      style={{ color: "var(--color-muted)" }}
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.selectedSize,
                          item.selectedColor,
                          item.quantity - 1
                        )
                      }
                    >
                      <Minus size={12} />
                    </button>
                    <span
                      className="w-8 h-8 flex items-center justify-center text-sm"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center text-sm"
                      style={{ color: "var(--color-muted)" }}
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.selectedSize,
                          item.selectedColor,
                          item.quantity + 1
                        )
                      }
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-4 md:col-span-2 text-sm font-semibold text-right" style={{ color: "var(--color-primary)" }}>
                  {formatPrice(item.product.price * item.quantity)}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center mt-4 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
            <Link
              href="/shop"
              className="text-xs tracking-wide uppercase transition-colors hover:text-[var(--color-primary)]"
              style={{ color: "var(--color-muted)" }}
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={() => clearCart()}
              className="text-xs tracking-wide uppercase transition-colors hover:text-red-400"
              style={{ color: "var(--color-muted)" }}
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div
            className="border p-6 space-y-4"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            <h2
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "var(--color-foreground)" }}
            >
              Order Summary
            </h2>

            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--color-muted)" }}>Subtotal</span>
                <span style={{ color: "var(--color-foreground)" }}>{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--color-muted)" }}>Shipping</span>
                <span
                  style={{
                    color: shippingCost === 0 ? "var(--color-success)" : "var(--color-foreground)",
                  }}
                >
                  {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                </span>
              </div>
              {shipping.freeShippingThreshold > 0 && sub < shipping.freeShippingThreshold && (
                <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                  Add {formatPrice(shipping.freeShippingThreshold - sub)} more for free shipping
                </p>
              )}
            </div>

            <div
              className="flex justify-between items-center pt-3 border-t text-base font-semibold"
              style={{ borderColor: "var(--color-border)" }}
            >
              <span style={{ color: "var(--color-foreground)" }}>Total</span>
              <span style={{ color: "var(--color-primary)" }}>
                {formatPrice(sub + shippingCost)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="btn-primary w-full justify-center gap-2 mt-2"
            >
              Checkout
              <ArrowRight size={16} />
            </Link>

            <p className="text-xs text-center" style={{ color: "var(--color-muted)" }}>
              Cash on Delivery · No account needed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
