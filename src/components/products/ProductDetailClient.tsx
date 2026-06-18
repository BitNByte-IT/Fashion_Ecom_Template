"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Check, ChevronDown, Truck, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart.store";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { shipping as shippingConfig } from "@/config/store.config";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || "");
  const [qty, setQty] = useState(1);
  const [descOpen, setDescOpen] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  const discount = getDiscountPercent(product.originalPrice ?? 0, product.price);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      toast.error("Please select a size");
      return;
    }
    addItem(product, selectedSize, selectedColor, qty);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="container py-10 md:py-14">
      {/* Breadcrumb */}
      <nav className="text-xs mb-6 flex gap-2" style={{ color: "var(--color-muted)" }}>
        <a href="/" className="hover:text-[var(--color-primary)]">Home</a>
        <span>/</span>
        <a href="/shop" className="hover:text-[var(--color-primary)]">Shop</a>
        <span>/</span>
        <span style={{ color: "var(--color-foreground)" }}>{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-14">
        {/* Gallery */}
        <div className="md:w-1/2 lg:w-[55%]">
          {/* Main image */}
          <div
            className="relative aspect-[3/4] overflow-hidden mb-3"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <Image
              src={product.images[selectedImage] || "/images/products/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5">
                -{discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className="relative w-20 h-24 flex-shrink-0 overflow-hidden"
                  style={{
                    border: `2px solid ${i === selectedImage ? "var(--color-primary)" : "var(--color-border)"}`,
                  }}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="md:w-1/2 lg:w-[45%] flex flex-col gap-5">
          {/* Tags */}
          <div className="flex gap-2">
            {product.isNew && (
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--color-background)" }}
              >
                New
              </span>
            )}
            {product.isBestseller && (
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5"
                style={{ backgroundColor: "var(--color-surface)", color: "var(--color-muted)", border: "1px solid var(--color-border)" }}
              >
                Bestseller
              </span>
            )}
          </div>

          <h1
            className="text-2xl md:text-3xl font-light leading-tight tracking-wide"
            style={{ color: "var(--color-foreground)" }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold" style={{ color: "var(--color-primary)" }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-base line-through" style={{ color: "var(--color-muted)" }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Color selector */}
          {product.colors.length > 0 && (
            <div>
              <p className="label">
                Color: <span style={{ color: "var(--color-foreground)" }}>{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className="relative px-3 py-1.5 text-sm border transition-colors"
                    style={{
                      borderColor:
                        selectedColor === color
                          ? "var(--color-primary)"
                          : "var(--color-border)",
                      color:
                        selectedColor === color
                          ? "var(--color-primary)"
                          : "var(--color-muted)",
                    }}
                  >
                    {color}
                    {selectedColor === color && (
                      <Check
                        size={10}
                        className="absolute top-0.5 right-0.5"
                        style={{ color: "var(--color-primary)" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes.length > 0 && (
            <div>
              <p className="label">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="w-11 h-11 text-sm font-medium border transition-colors"
                    style={{
                      borderColor:
                        selectedSize === size
                          ? "var(--color-primary)"
                          : "var(--color-border)",
                      color:
                        selectedSize === size
                          ? "var(--color-primary)"
                          : "var(--color-muted)",
                      backgroundColor:
                        selectedSize === size ? "transparent" : undefined,
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add to cart */}
          <div className="flex gap-3 mt-1">
            <div
              className="flex items-center border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <button
                className="w-10 h-12 flex items-center justify-center text-lg transition-colors hover:text-[var(--color-primary)]"
                style={{ color: "var(--color-muted)" }}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span
                className="w-10 h-12 flex items-center justify-center text-sm"
                style={{ color: "var(--color-foreground)" }}
              >
                {qty}
              </span>
              <button
                className="w-10 h-12 flex items-center justify-center text-lg transition-colors hover:text-[var(--color-primary)]"
                style={{ color: "var(--color-muted)" }}
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={cn("btn-primary flex-1 gap-2", !product.inStock && "opacity-50 cursor-not-allowed")}
            >
              <ShoppingBag size={16} />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          {/* Shipping info */}
          <div
            className="border p-4 space-y-2.5"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-start gap-3">
              <Truck size={16} className="flex-shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>
                  Cash on Delivery
                </p>
                <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                  Inside city: ৳{shippingConfig.insideCity} · Outside: ৳{shippingConfig.outsideCity}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RefreshCw size={16} className="flex-shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>
                  Easy Returns
                </p>
                <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                  7-day return policy
                </p>
              </div>
            </div>
          </div>

          {/* Description accordion */}
          <div className="border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => setDescOpen((v) => !v)}
            >
              <span className="text-sm font-semibold tracking-wide" style={{ color: "var(--color-foreground)" }}>
                Description
              </span>
              <ChevronDown
                size={16}
                className={cn("transition-transform", descOpen && "rotate-180")}
                style={{ color: "var(--color-muted)" }}
              />
            </button>
            {descOpen && (
              <p className="text-sm mt-3 leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {product.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
