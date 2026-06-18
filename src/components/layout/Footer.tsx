import Link from "next/link";
import { brand, footer, contact } from "@/config/store.config";

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

export default function Footer() {
  return (
    <footer
      className="border-t mt-16"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <p
              className="text-xl font-light tracking-[0.2em] uppercase mb-3"
              style={{ color: "var(--color-foreground)" }}
            >
              {brand.name}
            </p>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--color-muted)" }}>
              {footer.tagline}
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              {contact.social.facebook && (
                <a
                  href={contact.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center border transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
              )}
              {contact.social.instagram && (
                <a
                  href={contact.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center border transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
              )}
              {contact.social.youtube && (
                <a
                  href={contact.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center border transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}
                  aria-label="YouTube"
                >
                  <YoutubeIcon />
                </a>
              )}
            </div>
          </div>

          {/* Link columns */}
          {footer.columns.map((col) => (
            <div key={col.heading}>
              <h4
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: "var(--color-foreground)" }}
              >
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-[var(--color-primary)]"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "var(--color-foreground)" }}
            >
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "var(--color-muted)" }}>
              <li>{contact.phone}</li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  {contact.email}
                </a>
              </li>
              <li>{contact.address}</li>
              <li className="text-xs">{contact.hours}</li>
            </ul>
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-xs tracking-wide uppercase border px-3 py-1.5 transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}
              >
                WhatsApp Us
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t py-5"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="container flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            {footer.bottomNote}
          </p>
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            Cash on Delivery · Made with care in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
