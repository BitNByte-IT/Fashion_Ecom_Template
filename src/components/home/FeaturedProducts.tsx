import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getFeaturedProducts, getNewArrivals, getBestsellers } from "@/lib/products";

type Tab = "featured" | "new" | "bestsellers";

interface Props {
  tab?: Tab;
  title?: string;
  subtitle?: string;
  limit?: number;
}

export default async function FeaturedProducts({
  tab = "featured",
  title = "Featured",
  subtitle = "Products",
  limit = 8,
}: Props) {
  const products =
    tab === "new"
      ? await getNewArrivals(limit)
      : tab === "bestsellers"
      ? await getBestsellers(limit)
      : await getFeaturedProducts(limit);

  return (
    <section className="py-14 md:py-20">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="section-title">
              {title} <span>{subtitle}</span>
            </h2>
            <div className="section-divider" />
          </div>
          <Link
            href="/shop"
            className="text-xs tracking-widest uppercase border-b pb-0.5 transition-colors hover:text-[var(--color-primary)]"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-muted)",
            }}
          >
            View All
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-center py-12" style={{ color: "var(--color-muted)" }}>
            No products found.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
