"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroBanners } from "@/config/store.config";
import { cn } from "@/lib/utils";

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const go = useCallback(
    (index: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setCurrent((index + heroBanners.length) % heroBanners.length);
      setTimeout(() => setTransitioning(false), 500);
    },
    [transitioning]
  );

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => go(current + 1), 6000);
    return () => clearInterval(id);
  }, [current, go]);

  const banner = heroBanners[current];

  const alignClass =
    banner.align === "center"
      ? "items-center text-center"
      : banner.align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  return (
    <section className="relative h-[70vh] min-h-[500px] md:h-[85vh] overflow-hidden">
      {/* Slides */}
      {heroBanners.map((b, i) => (
        <div
          key={b.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <Image
            src={b.image}
            alt={b.heading}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content */}
      <div
        className={cn(
          "relative z-10 h-full container flex flex-col justify-center gap-5 py-16",
          alignClass
        )}
      >
        <h1
          className={cn(
            "text-4xl sm:text-5xl md:text-6xl font-light tracking-wide leading-tight text-white",
            transitioning && "opacity-0 translate-y-2 transition-all duration-300",
            !transitioning && "opacity-100 translate-y-0 transition-all duration-500"
          )}
          style={{ whiteSpace: "pre-line" }}
        >
          {banner.heading}
        </h1>
        <p
          className="text-base md:text-lg text-white/80 tracking-wide max-w-md"
          style={{ marginInline: banner.align === "center" ? "auto" : undefined }}
        >
          {banner.subheading}
        </p>
        <Link href={banner.ctaHref} className="btn-primary self-start" style={{ alignSelf: banner.align === "center" ? "center" : banner.align === "right" ? "flex-end" : "flex-start" }}>
          {banner.ctaLabel}
        </Link>
      </div>

      {/* Arrows */}
      {heroBanners.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors text-white"
            onClick={() => go(current - 1)}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors text-white"
            onClick={() => go(current + 1)}
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {heroBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={cn(
                  "h-0.5 transition-all duration-300",
                  i === current ? "w-8 bg-white" : "w-4 bg-white/40"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
