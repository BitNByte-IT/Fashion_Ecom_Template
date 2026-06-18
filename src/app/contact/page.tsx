"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { contact, brand } from "@/config/store.config";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* Header */}
      <section
        className="py-14 text-center border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "var(--color-primary)" }}
        >
          Get in Touch
        </p>
        <h1 className="section-title justify-center">
          Contact <span>Us</span>
        </h1>
      </section>

      <div className="container py-14 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2
              className="text-sm font-semibold tracking-widest uppercase mb-6"
              style={{ color: "var(--color-foreground)" }}
            >
              We&apos;d love to hear from you
            </h2>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: "var(--color-muted)" }}>
              Have a question about your order? Looking for styling advice? We&apos;re here to help. Reach out via any of the methods below.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Phone size={18} className="flex-shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
                <div>
                  <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "var(--color-muted)" }}>Phone</p>
                  <a href={`tel:${contact.phone}`} className="text-sm hover:text-[var(--color-primary)] transition-colors" style={{ color: "var(--color-foreground)" }}>
                    {contact.phone}
                  </a>
                </div>
              </div>

              {contact.whatsapp && (
                <div className="flex items-start gap-4">
                  <MessageCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "var(--color-muted)" }}>WhatsApp</p>
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-[var(--color-primary)] transition-colors"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {contact.whatsapp}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <Mail size={18} className="flex-shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
                <div>
                  <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "var(--color-muted)" }}>Email</p>
                  <a href={`mailto:${contact.email}`} className="text-sm hover:text-[var(--color-primary)] transition-colors" style={{ color: "var(--color-foreground)" }}>
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
                <div>
                  <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "var(--color-muted)" }}>Address</p>
                  <p className="text-sm" style={{ color: "var(--color-foreground)" }}>{contact.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock size={18} className="flex-shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
                <div>
                  <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "var(--color-muted)" }}>Hours</p>
                  <p className="text-sm" style={{ color: "var(--color-foreground)" }}>{contact.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div
            className="border p-6 md:p-8"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-10 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: "var(--color-background)" }}
                >
                  ✓
                </div>
                <p className="text-base font-medium" style={{ color: "var(--color-foreground)" }}>
                  Message sent!
                </p>
                <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2
                  className="text-sm font-semibold tracking-widest uppercase mb-5"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Send a Message
                </h2>
                <div>
                  <label className="label">Name *</label>
                  <input className="input" value={form.name} onChange={set("name")} required placeholder="Your name" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" type="tel" value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
                </div>
                <div>
                  <label className="label">Message *</label>
                  <textarea
                    className="input"
                    rows={5}
                    value={form.message}
                    onChange={set("message")}
                    required
                    placeholder="How can we help you?"
                    style={{ resize: "vertical" }}
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
