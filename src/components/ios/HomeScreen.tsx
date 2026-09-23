"use client";

import { AppIcon } from "@/system/icons";
import { IOS_APPS, IOS_HOME_APPS } from "@/system/ios-apps";
import type { IconOrigin } from "@/system/ios-store";
import { useIOS } from "@/system/ios-store";
import type { AppId } from "@/system/store";
import { STATUS_BAR_H } from "./StatusBar";

export const HOME_ICON_SIZE = 62;

/** Single-page 4-column icon grid. */
export function HomeScreen({ dimmed }: { dimmed: boolean }) {
  const open = useIOS((s) => s.open);

  return (
    <div
      aria-hidden={dimmed}
      className="absolute inset-0 overflow-hidden px-3 transition-[transform,opacity] duration-[320ms]"
      style={{
        pointerEvents: dimmed ? "none" : "auto",
        paddingTop: `calc(${STATUS_BAR_H + 12}px + env(safe-area-inset-top, 0px))`,
        transform: dimmed ? "scale(0.94)" : "scale(1)",
        opacity: dimmed ? 0 : 1,
        transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >
      <div className="grid grid-cols-4 gap-x-2 gap-y-[18px]">
        {IOS_HOME_APPS.map((id) => (
          <HomeIcon key={id} id={id} onOpen={open} />
        ))}
      </div>
    </div>
  );
}

export function HomeIcon({
  id,
  onOpen,
  size = HOME_ICON_SIZE,
  showLabel = true,
}: {
  id: AppId;
  onOpen: (id: AppId, origin?: IconOrigin | null) => void;
  size?: number;
  showLabel?: boolean;
}) {
  const tap = (e: React.MouseEvent<HTMLButtonElement>) => {
    const icon = e.currentTarget.querySelector("[data-icon]") ?? e.currentTarget;
    const r = icon.getBoundingClientRect();
    onOpen(id, { x: r.left, y: r.top, w: r.width, h: r.height });
  };

  return (
    <button
      onClick={tap}
      className="flex flex-col items-center gap-[5px] transition-transform duration-150 active:scale-[0.9]"
      aria-label={IOS_APPS[id].label}
    >
      <span data-icon className="block" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))" }}>
        <AppIcon id={id} size={size} />
      </span>
      {showLabel && (
        <span
          className="max-w-[74px] truncate text-[11px] font-medium text-white"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7), 0 0 10px rgba(0,0,0,0.3)" }}
        >
          {IOS_APPS[id].label}
        </span>
      )}
    </button>
  );
}
