"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, ChevronDown } from "lucide-react";
import { brand, navigation, announcement } from "@/config/store.config";
import { useCartStore } from "@/store/cart.store";
import { cn } from "@/lib/utils";
import SearchModal from "@/components/layout/SearchModal";
import MobileMenu from "@/components/layout/MobileMenu";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

// Announcement bar height: py-2 (16px) + text-xs line-height (~20px) = ~36px
const ANNOUNCEMENT_H = announcement.enabled ? 36 : 0;

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > ANNOUNCEMENT_H + 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Single fixed wrapper — announcement bar + nav share one fixed container */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <AnnouncementBar />
        <header
          className={cn(
            "transition-all duration-300 border-b",
            scrolled
              ? "shadow-md"
              : "border-transparent"
          )}
          style={{
            backgroundColor: scrolled
              ? "var(--color-background)"
              : "rgba(10,10,10,0.55)",
            backdropFilter: !scrolled ? "blur(8px)" : undefined,
            borderColor: scrolled ? "var(--color-border)" : "transparent",
          }}
        >
          <div className="container">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Mobile menu toggle */}
              <button
                className="md:hidden btn-ghost p-2"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center">
                <span
                  className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {brand.name}
                </span>
              </Link>

              {/* Desktop navigation */}
              <nav className="hidden md:flex items-center gap-1" ref={dropdownRef}>
                {navigation.map((item) => (
                  <div key={item.href} className="relative">
                    {item.children ? (
                      <button
                        className={cn(
                          "flex items-center gap-1 px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors",
                          pathname === item.href
                            ? "text-[var(--color-primary)]"
                            : "text-[var(--color-foreground)] hover:text-[var(--color-primary)]"
                        )}
                        onClick={() =>
                          setActiveDropdown(activeDropdown === item.label ? null : item.label)
                        }
                      >
                        {item.label}
                        <ChevronDown
                          size={14}
                          className={cn("transition-transform", activeDropdown === item.label && "rotate-180")}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors",
                          pathname === item.href
                            ? "text-[var(--color-primary)]"
                            : "text-[var(--color-foreground)] hover:text-[var(--color-primary)]"
                        )}
                      >
                        {item.label}
                      </Link>
                    )}

                    {item.children && activeDropdown === item.label && (
                      <div
                        className="absolute top-full left-0 mt-1 min-w-[200px] py-2 z-50 border"
                        style={{
                          backgroundColor: "var(--color-surface)",
                          borderColor: "var(--color-border)",
                        }}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block px-5 py-2.5 text-sm tracking-wide hover:text-[var(--color-primary)] transition-colors"
                            style={{ color: "var(--color-foreground)" }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  className="btn-ghost p-2"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                <button
                  className="btn-ghost p-2 relative"
                  onClick={openCart}
                  aria-label="Shopping cart"
                >
                  <ShoppingBag size={20} />
                  {mounted && itemCount > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded-full badge-pulse"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-background)",
                      }}
                    >
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Spacer — accounts for both announcement bar + navbar height */}
      <div
        style={{
          height: `${ANNOUNCEMENT_H + 64}px`,
        }}
        className="md:hidden"
      />
      <div
        style={{
          height: `${ANNOUNCEMENT_H + 80}px`,
        }}
        className="hidden md:block"
      />

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
