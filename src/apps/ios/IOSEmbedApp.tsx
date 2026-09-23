"use client";

import { useState } from "react";

/**
 * Factory for the two Expo apps (B3VO, CAMPUS) on the iOS shell. They are
 * already iPhone apps, so they run edge-to-edge instead of inside the
 * iPhone-shaped frame the macOS shell wraps them in. Their web builds supply
 * their own iPhone safe-area insets, so the shell's status bar overlays the
 * space they already reserve.
 */
export function makeIOSEmbedApp({
  name,
  src,
  logo,
  bg = "#F5F0EB",
}: {
  name: string;
  src: string;
  logo: string;
  bg?: string;
}) {
  return function IOSEmbedApp() {
    const [loaded, setLoaded] = useState(false);
    return (
      <div className="relative h-full w-full" style={{ background: bg }}>
        {!loaded && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
            style={{ background: bg }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="" width={76} height={76} draggable={false} className="animate-pulse" />
            <span className="text-[12.5px]" style={{ color: "rgba(60,50,40,0.5)" }}>
              Opening {name}…
            </span>
          </div>
        )}
        <iframe
          src={src}
          title={name}
          onLoad={() => setLoaded(true)}
          className="h-full w-full border-0"
          style={{ display: "block", background: bg }}
          allow="autoplay; microphone; clipboard-write"
        />
      </div>
    );
  };
}
