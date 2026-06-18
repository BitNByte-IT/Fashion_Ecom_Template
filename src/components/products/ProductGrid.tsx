import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types";

interface Props {
  products: Product[];
}

export default function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-lg" style={{ color: "var(--color-muted)" }}>
          No products found
        </p>
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
