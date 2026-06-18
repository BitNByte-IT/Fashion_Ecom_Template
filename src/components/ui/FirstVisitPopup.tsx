"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { popup } from "@/config/store.config";

export default function FirstVisitPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!popup.enabled) return;

    const key = "popup-last-seen";
    const lastSeen = localStorage.getItem(key);
    const now = Date.now();
    const cooldownMs = popup.cooldownDays * 24 * 60 * 60 * 1000;

    if (!lastSeen || now - parseInt(lastSeen) > cooldownMs) {
      const timer = setTimeout(() => setVisible(true), popup.showDelayMs);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("popup-last-seen", Date.now().toString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="overlay" style={{ zIndex: 60 }} onClick={dismiss} />
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
      >
        <div
          className="relative w-full max-w-3xl flex flex-col md:flex-row overflow-hidden fade-in-up"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          {/* Image side */}
          <div className="relative h-48 md:h-auto md:w-1/2 flex-shrink-0">
            <Image
              src={popup.image}
              alt="Welcome"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Content side */}
          <div className="flex-1 flex flex-col justify-center p-8 md:p-10">
            <p
              className="text-xs tracking-[0.2em] uppercase mb-3"
              style={{ color: "var(--color-primary)" }}
            >
              {popup.badge}
            </p>
            <h2
              className="text-2xl md:text-3xl font-light tracking-wide mb-3"
              style={{ color: "var(--color-foreground)" }}
            >
              {popup.heading}
            </h2>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--color-muted)" }}>
              {popup.subheading}
            </p>
            <Link href={popup.ctaHref} onClick={dismiss} className="btn-primary mb-3 text-center">
              {popup.ctaLabel}
            </Link>
            <button
              onClick={dismiss}
              className="text-xs tracking-wide uppercase transition-colors hover:text-[var(--color-primary)]"
              style={{ color: "var(--color-muted)" }}
            >
              {popup.dismissLabel}
            </button>
          </div>

          {/* Close button */}
          <button
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-colors"
            style={{ color: "var(--color-muted)" }}
            onClick={dismiss}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
