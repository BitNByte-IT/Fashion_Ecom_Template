"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { featuredCategories } from "@/config/store.config";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Bestsellers", value: "bestseller" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ShopFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const category = params.get("category") || "";
  const tag = params.get("tag") || "";
  const sort = params.get("sort") || "newest";
  const q = params.get("q") || "";
  const size = params.get("size") || "";

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    if (value) {
      p.set(key, value);
    } else {
      p.delete(key);
    }
    router.push(`/shop?${p.toString()}`);
  };

  const clearAll = () => router.push("/shop");
  const hasFilters = !!(category || tag || size || q);

  const FilterContent = () => (
    <div className="space-y-7">
      {/* Categories */}
      <div>
        <h3
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "var(--color-foreground)" }}
        >
          Category
        </h3>
        <ul className="space-y-1.5">
          <li>
            <button
              onClick={() => setParam("category", "")}
              className={cn(
                "text-sm transition-colors",
                !category
                  ? "text-[var(--color-primary)] font-medium"
                  : "hover:text-[var(--color-primary)]"
              )}
              style={{ color: category ? "var(--color-muted)" : undefined }}
            >
              All Products
            </button>
          </li>
          {featuredCategories.map((cat) => (
            <li key={cat.slug}>
              <button
                onClick={() => setParam("category", cat.slug)}
                className={cn(
                  "text-sm transition-colors",
                  category === cat.slug
                    ? "text-[var(--color-primary)] font-medium"
                    : "hover:text-[var(--color-primary)]"
                )}
                style={{ color: category !== cat.slug ? "var(--color-muted)" : undefined }}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div>
        <h3
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "var(--color-foreground)" }}
        >
          Collection
        </h3>
        <ul className="space-y-1.5">
          {["new", "bestseller", "sale"].map((t) => (
            <li key={t}>
              <button
                onClick={() => setParam("tag", tag === t ? "" : t)}
                className={cn(
                  "text-sm capitalize transition-colors",
                  tag === t
                    ? "text-[var(--color-primary)] font-medium"
                    : "hover:text-[var(--color-primary)]"
                )}
                style={{ color: tag !== t ? "var(--color-muted)" : undefined }}
              >
                {t === "new" ? "New Arrivals" : t === "bestseller" ? "Bestsellers" : "Sale"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sizes */}
      <div>
        <h3
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "var(--color-foreground)" }}
        >
          Size
        </h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setParam("size", size === s ? "" : s)}
              className="w-10 h-10 text-xs font-medium border transition-colors"
              style={{
                borderColor:
                  size === s ? "var(--color-primary)" : "var(--color-border)",
                color:
                  size === s ? "var(--color-primary)" : "var(--color-muted)",
                backgroundColor:
                  size === s ? "transparent" : undefined,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs tracking-wide uppercase transition-colors hover:text-[var(--color-primary)]"
          style={{ color: "var(--color-muted)" }}
        >
          <X size={12} />
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 text-sm border px-4 py-2"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-foreground)",
          }}
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "var(--color-muted)" }}>
            Sort:
          </span>
          <select
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="select text-sm py-1.5 px-3 w-auto"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="overlay" onClick={() => setMobileOpen(false)} />
          <div
            className="fixed top-0 left-0 bottom-0 w-[280px] z-50 p-6 overflow-y-auto slide-in-right"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <span
                className="text-sm font-semibold tracking-widest uppercase"
                style={{ color: "var(--color-foreground)" }}
              >
                Filters
              </span>
              <button className="btn-ghost p-1" onClick={() => setMobileOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <FilterContent />
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-52 flex-shrink-0">
        {/* Sort */}
        <div className="mb-7">
          <h3
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "var(--color-foreground)" }}
          >
            Sort By
          </h3>
          <select
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="select text-sm py-2 px-3"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className="border-t pt-7"
          style={{ borderColor: "var(--color-border)" }}
        >
          <FilterContent />
        </div>
      </aside>
    </>
  );
}
