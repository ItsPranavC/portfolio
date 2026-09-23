"use client";

import { useEffect, useState } from "react";

/** Height of the status bar, excluding the device safe-area inset. */
export const STATUS_BAR_H = 44;

export type StatusTint = "light" | "dark";

/**
 * iOS status bar: clock on the left, signal / Wi-Fi / battery on the right.
 * Floats above both the home screen and any open app.
 */
export function StatusBar({ tint }: { tint: StatusTint }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }).replace(/\s?[AP]M$/i, "")
      );
    tick();
    const t = setInterval(tick, 15000);
    return () => clearInterval(t);
  }, []);

  const color = tint === "light" ? "#fff" : "#000";
  const shadow = tint === "light" ? "0 1px 3px rgba(0,0,0,0.35)" : "none";

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[400] flex items-end justify-between px-[26px] pb-[7px]"
      style={{
        height: `calc(${STATUS_BAR_H}px + env(safe-area-inset-top, 0px))`,
        color,
        textShadow: shadow,
      }}
    >
      <span className="text-[15px] font-semibold tracking-[0.1px]" style={{ minWidth: 54 }}>
        {time ?? ""}
      </span>

      <span className="flex items-center gap-[5px]">
        {/* signal */}
        <svg width="18" height="11" viewBox="0 0 18 11" fill={color} aria-hidden>
          <rect x="0" y="7.5" width="3" height="3.5" rx="1" />
          <rect x="4.8" y="5.5" width="3" height="5.5" rx="1" />
          <rect x="9.6" y="3" width="3" height="8" rx="1" />
          <rect x="14.4" y="0.5" width="3" height="10.5" rx="1" />
        </svg>
        {/* wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" aria-hidden>
          <path d="M1 3.6 A10 10 0 0 1 15 3.6" />
          <path d="M3.7 6.3 A6.2 6.2 0 0 1 12.3 6.3" />
          <path d="M6.4 8.9 A2.4 2.4 0 0 1 9.6 8.9" />
        </svg>
        {/* battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden>
          <rect x="0.6" y="0.6" width="20" height="10.8" rx="3.2" fill="none" stroke={color} strokeOpacity="0.4" strokeWidth="1.1" />
          <rect x="2.2" y="2.2" width="14.6" height="7.6" rx="2.1" fill={color} />
          <path d="M22.2 4.2 v3.6 a2.6 2.6 0 0 0 1.6-1.8 a2.6 2.6 0 0 0 -1.6-1.8 Z" fill={color} fillOpacity="0.45" />
        </svg>
      </span>
    </div>
  );
}
