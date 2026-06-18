"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";
import { shipping } from "@/config/store.config";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCartStore();
  const sub = subtotal();
  const shippingCost = sub >= shipping.freeShippingThreshold && shipping.freeShippingThreshold > 0
    ? 0
    : shipping.outsideCity;

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={closeCart} />
      <div
        className="fixed top-0 right-0 bottom-0 w-full max-w-[420px] z-50 flex flex-col slide-in-right"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} style={{ color: "var(--color-primary)" }} />
            <h2
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "var(--color-foreground)" }}
            >
              Cart ({items.length})
            </h2>
          </div>
          <button className="btn-ghost p-1" onClick={closeCart} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free shipping progress */}
        {shipping.freeShippingThreshold > 0 && (
          <div className="px-6 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
            {sub >= shipping.freeShippingThreshold ? (
              <p className="text-xs text-center tracking-wide" style={{ color: "var(--color-success)" }}>
                ✓ You qualify for free shipping!
              </p>
            ) : (
              <>
                <p className="text-xs mb-1.5" style={{ color: "var(--color-muted)" }}>
                  Add{" "}
                  <span style={{ color: "var(--color-primary)" }}>
                    {formatPrice(shipping.freeShippingThreshold - sub)}
                  </span>{" "}
                  more for free shipping
                </p>
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--color-border)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      width: `${Math.min((sub / shipping.freeShippingThreshold) * 100, 100)}%`,
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
              <ShoppingBag size={48} style={{ color: "var(--color-border)" }} />
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                Your cart is empty
              </p>
              <button onClick={closeCart} className="btn-outline text-sm py-2 px-6">
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--color-border)" }}>
              {items.map((item) => (
                <li
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="flex gap-4 px-6 py-4"
                >
                  {/* Image */}
                  <div
                    className="relative w-20 h-24 flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: "var(--color-background)" }}
                  >
                    <Image
                      src={item.product.images[0] || "/images/products/placeholder.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium leading-tight truncate"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {item.product.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                      {item.selectedSize} / {item.selectedColor}
                    </p>
                    <p className="text-sm font-semibold mt-1" style={{ color: "var(--color-primary)" }}>
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Qty + remove */}
                    <div className="flex items-center gap-3 mt-2">
                      <div
                        className="flex items-center border"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        <button
                          className="w-7 h-7 flex items-center justify-center transition-colors"
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
                          className="w-7 h-7 flex items-center justify-center text-sm"
                          style={{ color: "var(--color-foreground)" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          className="w-7 h-7 flex items-center justify-center transition-colors"
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
                      <button
                        className="p-1 transition-colors"
                        style={{ color: "var(--color-muted)" }}
                        onClick={() =>
                          removeItem(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-6 py-5 border-t space-y-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex justify-between text-sm" style={{ color: "var(--color-muted)" }}>
              <span>Subtotal</span>
              <span style={{ color: "var(--color-foreground)" }}>{formatPrice(sub)}</span>
            </div>
            <div className="flex justify-between text-sm" style={{ color: "var(--color-muted)" }}>
              <span>Shipping</span>
              <span style={{ color: shippingCost === 0 ? "var(--color-success)" : "var(--color-foreground)" }}>
                {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
              </span>
            </div>
            <div
              className="flex justify-between text-base font-semibold border-t pt-3"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }}
            >
              <span>Total</span>
              <span style={{ color: "var(--color-primary)" }}>
                {formatPrice(sub + shippingCost)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center text-sm"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={closeCart}
              className="btn-ghost w-full justify-center text-xs"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
