"use client";

import { IOS_DOCK_APPS } from "@/system/ios-apps";
import { useIOS } from "@/system/ios-store";
import { HomeIcon } from "./HomeScreen";

/** Liquid-glass dock pinned above the home indicator. */
export function IOSDock({ dimmed }: { dimmed: boolean }) {
  const open = useIOS((s) => s.open);

  return (
    <div
      aria-hidden={dimmed}
      className="absolute bottom-0 left-0 right-0 z-[120] px-3 transition-[transform,opacity] duration-[320ms]"
      style={{
        pointerEvents: dimmed ? "none" : "auto",
        paddingBottom: `calc(14px + env(safe-area-inset-bottom, 0px))`,
        transform: dimmed ? "translateY(14px) scale(0.96)" : "none",
        opacity: dimmed ? 0 : 1,
        transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >
      <div
        className="flex items-center justify-around rounded-[34px] px-2.5 py-2.5"
        style={{
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          border: "0.5px solid rgba(255,255,255,0.3)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        {IOS_DOCK_APPS.map((id) => (
          <HomeIcon key={id} id={id} onOpen={open} size={60} showLabel={false} />
        ))}
      </div>
    </div>
  );
}
