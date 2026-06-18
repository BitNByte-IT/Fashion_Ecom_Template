"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import type { Product } from "@/types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const discount = getDiscountPercent(product.originalPrice ?? 0, product.price);

  return (
    <article className="group relative">
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="block">
        <div
          className="relative aspect-[3/4] overflow-hidden product-image-wrapper"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <Image
            src={product.images[0] || "/images/products/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Second image on hover */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {product.isNew && (
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-background)",
                }}
              >
                New
              </span>
            )}
            {discount > 0 && (
              <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 bg-red-600 text-white">
                -{discount}%
              </span>
            )}
            {!product.inStock && (
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5"
                style={{ backgroundColor: "var(--color-surface)", color: "var(--color-muted)" }}
              >
                Sold Out
              </span>
            )}
          </div>

          {/* Quick add overlay — plain div, outer Link handles navigation */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div
              className="flex items-center justify-center gap-2 py-3 text-xs font-semibold tracking-widest uppercase w-full"
              style={{
                backgroundColor: "var(--color-background)",
                color: "var(--color-primary)",
              }}
            >
              <ShoppingBag size={14} />
              Select Options
            </div>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <Link
          href={`/shop/${product.slug}`}
          className="block text-sm font-medium leading-snug hover:text-[var(--color-primary)] transition-colors"
          style={{ color: "var(--color-foreground)" }}
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs line-through" style={{ color: "var(--color-muted)" }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {/* Color dots */}
        {product.colors.length > 0 && (
          <div className="flex gap-1 mt-1.5">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="text-[10px] px-1.5 py-0.5 border"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-muted)",
                }}
              >
                {color}
              </span>
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px]" style={{ color: "var(--color-muted)" }}>
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
