import Image from "next/image";
import Link from "next/link";
import { featuredCategories } from "@/config/store.config";

export default function CategorySection() {
  return (
    <section className="py-14 md:py-20">
      <div className="container">
        {/* Heading */}
        <div className="mb-10">
          <h2 className="section-title">
            Shop by <span>Category</span>
          </h2>
          <div className="section-divider" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group relative overflow-hidden aspect-[3/4] block"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-xs md:text-sm font-medium tracking-widest uppercase">
                  {cat.name}
                </p>
              </div>
              {/* Hover border */}
              <div
                className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ borderColor: "var(--color-primary)" }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
