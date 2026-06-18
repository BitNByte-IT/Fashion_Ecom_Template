"use client";

import { useState } from "react";
import { brand, contact } from "@/config/store.config";

export default function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // In production, connect to your email marketing tool here
    setSubmitted(true);
  };

  return (
    <section
      className="py-16 md:py-20"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="container max-w-2xl text-center">
        <p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "var(--color-primary)" }}
        >
          Stay in the loop
        </p>
        <h2 className="section-title mb-2">
          Join the <span>{brand.name}</span> Family
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--color-muted)" }}>
          Subscribe for early access to new collections, exclusive offers, and style inspiration.
        </p>

        {submitted ? (
          <p className="text-sm font-medium" style={{ color: "var(--color-success)" }}>
            ✓ Thank you! You&apos;re on the list.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-0 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input flex-1"
              required
              style={{ borderRight: "none" }}
            />
            <button type="submit" className="btn-primary whitespace-nowrap px-6">
              Subscribe
            </button>
          </form>
        )}

        {/* Social nudge */}
        <p className="text-xs mt-6" style={{ color: "var(--color-muted)" }}>
          Or follow us on{" "}
          {contact.social.instagram && (
            <a
              href={contact.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-primary)] transition-colors"
            >
              Instagram
            </a>
          )}{" "}
          for daily style updates.
        </p>
      </div>
    </section>
  );
}
