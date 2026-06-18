import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, fetchProducts } from "@/lib/products";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { brand } from "@/config/store.config";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${brand.name}`,
    description: product.description,
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <ProductDetailClient product={product} />
      <div
        className="border-t mt-12"
        style={{ borderColor: "var(--color-border)" }}
      >
        <FeaturedProducts title="You May" subtitle="Also Like" limit={4} />
      </div>
    </>
  );
}
