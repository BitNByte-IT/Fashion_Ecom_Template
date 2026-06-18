"use client";

import { announcement } from "@/config/store.config";

export default function AnnouncementBar() {
  if (!announcement.enabled) return null;

  const repeated = [...announcement.messages, ...announcement.messages];

  return (
    <div
      className="w-full overflow-hidden py-2 text-xs tracking-widest uppercase"
      style={{
        backgroundColor: "var(--color-primary)",
        color: "var(--color-background)",
      }}
    >
      <div className="marquee-inner flex whitespace-nowrap">
        {repeated.map((msg, i) => (
          <span key={i} className="mx-8 flex items-center gap-2">
            <span className="opacity-60">✦</span>
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
