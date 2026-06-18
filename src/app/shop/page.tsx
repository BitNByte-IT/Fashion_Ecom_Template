import { Suspense } from "react";
import { fetchProducts } from "@/lib/products";
import ProductGrid from "@/components/products/ProductGrid";
import ShopFilters from "@/components/products/ShopFilters";
import type { Product } from "@/types";
import type { Metadata } from "next";
import { brand } from "@/config/store.config";

export const metadata: Metadata = {
  title: `Shop — ${brand.name}`,
  description: "Browse our full collection of fashion and clothing.",
};

interface Props {
  searchParams: Promise<{ category?: string; tag?: string; sort?: string; q?: string; size?: string }>;
}

function filterAndSort(
  products: Product[],
  { category, tag, sort, q, size }: { category?: string; tag?: string; sort?: string; q?: string; size?: string }
): Product[] {
  let result = [...products];

  if (category) result = result.filter((p) => p.category === category);
  if (tag) result = result.filter((p) => p.tags.includes(tag));
  if (size) result = result.filter((p) => p.sizes.includes(size));
  if (q) {
    const query = q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.includes(query)) ||
        p.category.includes(query)
    );
  }

  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "bestseller":
      result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
      break;
    default:
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  return result;
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const allProducts = await fetchProducts();
  const filtered = filterAndSort(allProducts, params);

  const heading =
    params.q
      ? `Results for "${params.q}"`
      : params.category
      ? params.category.charAt(0).toUpperCase() + params.category.slice(1)
      : params.tag === "new"
      ? "New Arrivals"
      : params.tag === "bestseller"
      ? "Bestsellers"
      : params.tag === "sale"
      ? "Sale"
      : "All Products";

  return (
    <div className="container py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="section-title">
          {heading}
        </h1>
        <div className="section-divider" />
        <p className="text-xs mt-3" style={{ color: "var(--color-muted)" }}>
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-10">
        {/* Filters sidebar */}
        <Suspense>
          <ShopFilters />
        </Suspense>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
