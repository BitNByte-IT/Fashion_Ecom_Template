"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";
import { brand, navigation, contact } from "@/config/store.config";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div
        className="fixed top-0 left-0 bottom-0 w-[300px] z-50 flex flex-col overflow-y-auto slide-in-right"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <span
            className="text-lg font-light tracking-[0.2em] uppercase"
            style={{ color: "var(--color-foreground)" }}
          >
            {brand.name}
          </span>
          <button className="btn-ghost p-1" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4">
          {navigation.map((item) => (
            <div key={item.href}>
              {item.children ? (
                <>
                  <button
                    className="w-full flex items-center justify-between px-6 py-3.5 text-sm font-medium tracking-widest uppercase transition-colors"
                    style={{ color: "var(--color-foreground)" }}
                    onClick={() =>
                      setExpanded(expanded === item.label ? null : item.label)
                    }
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={cn(
                        "transition-transform",
                        expanded === item.label && "rotate-180"
                      )}
                    />
                  </button>
                  {expanded === item.label && (
                    <div
                      className="border-t border-b py-1"
                      style={{
                        backgroundColor: "var(--color-background)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className="block px-8 py-2.5 text-sm transition-colors hover:text-[var(--color-primary)]"
                          style={{ color: "var(--color-muted)" }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block px-6 py-3.5 text-sm font-medium tracking-widest uppercase transition-colors hover:text-[var(--color-primary)]"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer info */}
        <div
          className="p-5 border-t text-xs space-y-1"
          style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}
        >
          <p>{contact.phone}</p>
          <p>{contact.email}</p>
        </div>
      </div>
    </>
  );
}
