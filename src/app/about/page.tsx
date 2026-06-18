import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { brand, contact } from "@/config/store.config";

export const metadata: Metadata = {
  title: `About Us — ${brand.name}`,
  description: brand.description,
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743121/fashion-store/misc/about-hero.jpg"
          alt="About us"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center px-4">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            Our Story
          </p>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-white">
            About {brand.name}
          </h1>
        </div>
      </section>

      <div className="container py-14 md:py-20 max-w-4xl">
        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="section-title mb-3">
              Who <span>We Are</span>
            </h2>
            <div className="section-divider mb-5" />
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-muted)" }}>
              {brand.name} was founded with a simple belief: every woman deserves to feel beautiful, confident, and comfortable in what she wears.
            </p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-muted)" }}>
              We curate fashion that blends contemporary style with the warmth of Bangladeshi craftsmanship — pieces you&apos;ll love wearing again and again.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
              From everyday casuals to festive ethnic wear, our collection is thoughtfully designed for the modern woman who appreciates quality, style, and value.
            </p>
          </div>
          <div
            className="relative aspect-[4/5] overflow-hidden"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <Image
              src="https://res.cloudinary.com/dsjlfrzot/image/upload/v1781743123/fashion-store/misc/about-story.jpg"
              alt="Our story"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="section-title mb-3 text-center">
            Our <span>Values</span>
          </h2>
          <div className="section-divider mx-auto mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: "✦",
                title: "Quality First",
                desc: "Every piece is carefully selected for fabric quality, finish, and durability.",
              },
              {
                icon: "♡",
                title: "Customer Love",
                desc: "We treat every customer like family. Your satisfaction is our priority.",
              },
              {
                icon: "⟳",
                title: "Sustainable Style",
                desc: "We work with responsible suppliers and reduce waste wherever possible.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="p-6 border text-center"
                style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
              >
                <span className="text-2xl mb-3 block" style={{ color: "var(--color-primary)" }}>
                  {v.icon}
                </span>
                <h3
                  className="text-sm font-semibold tracking-wide uppercase mb-2"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {v.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
            Ready to find your next favourite outfit?
          </p>
          <Link href="/shop" className="btn-primary">
            Explore the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
