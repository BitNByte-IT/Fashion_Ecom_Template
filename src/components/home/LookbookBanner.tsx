import Image from "next/image";
import Link from "next/link";
import { lookbook } from "@/config/store.config";

export default function LookbookBanner() {
  if (!lookbook.enabled) return null;

  return (
    <section className="py-6">
      <div className="container">
        <div className="relative overflow-hidden min-h-[420px] md:min-h-[520px] flex items-center">
          {/* Background image */}
          <Image
            src={lookbook.image}
            alt={lookbook.heading}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="relative z-10 p-10 md:p-16 max-w-lg">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: "var(--color-primary)" }}
            >
              {lookbook.subheading}
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white mb-4">
              {lookbook.heading}
            </h2>
            <p className="text-sm md:text-base text-white/70 mb-8 leading-relaxed">
              {lookbook.description}
            </p>
            <Link href={lookbook.ctaHref} className="btn-outline text-white border-white hover:bg-white hover:text-black">
              {lookbook.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
