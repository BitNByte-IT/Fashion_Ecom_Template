"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div
        className="fixed top-0 left-0 right-0 z-50 p-4 md:p-8"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <form onSubmit={handleSubmit} className="container">
          <div className="flex items-center gap-4 border-b py-4" style={{ borderColor: "var(--color-primary)" }}>
            <Search size={24} style={{ color: "var(--color-primary)" }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 bg-transparent text-xl outline-none"
              style={{ color: "var(--color-foreground)" }}
            />
            <button type="button" className="btn-ghost p-1" onClick={onClose}>
              <X size={22} />
            </button>
          </div>
          <p className="mt-3 text-xs tracking-widest uppercase" style={{ color: "var(--color-muted)" }}>
            Press Enter to search
          </p>
        </form>
      </div>
    </>
  );
}
