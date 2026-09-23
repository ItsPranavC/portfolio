"use client";

import { useEffect, useRef, useState } from "react";
import { IOS_APPS } from "@/system/ios-apps";
import { useIOS } from "@/system/ios-store";
import { STATUS_BAR_H, type StatusTint } from "./StatusBar";

/** Space kept clear at the bottom for the home indicator. */
const INDICATOR_AREA = 22;
/** Swipe distance that counts as a full "throw" back to the home screen. */
const SWIPE_RANGE = 120;
/** Past this much of the swipe, releasing closes the app. */
const SWIPE_COMMIT = 0.32;
/** Movement under this is a tap, not a drag. */
const TAP_SLOP = 8;

/** The hint is for first-time visitors; after this many app opens it stops. */
const HINT_KEY = "ios:home-hint";
const HINT_LIMIT = 3;

function hintsShown(): number {
  try {
    return Number(localStorage.getItem(HINT_KEY)) || 0;
  } catch {
    return HINT_LIMIT; // private mode / blocked storage: skip the hint
  }
}

function markHintShown() {
  try {
    localStorage.setItem(HINT_KEY, String(hintsShown() + 1));
  } catch {
    /* ignore */
  }
}

/**
 * Full-screen host for the open app: zooms out of the tapped icon, zooms back
 * into it on close, and owns the home indicator that exits the app.
 *
 * Leaving an app is the one gesture a visitor can't guess from a screenshot, so
 * the indicator does more work here than on a real iPhone: it tracks the swipe
 * live (the app shrinks as you pull up), answers a plain tap or click, thickens
 * under the cursor, and the first few times an app opens it says so out loud.
 */
export function AppHost({ tint }: { tint: StatusTint }) {
  const appId = useIOS((s) => s.openApp);
  const phase = useIOS((s) => s.phase);
  const origin = useIOS((s) => s.origin);
  const close = useIOS((s) => s.close);

  /** 0 → 1 while the user drags the indicator up. */
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hint, setHint] = useState(false);
  const start = useRef<{ y: number; moved: number } | null>(null);

  // Esc exits too — mainly for previewing the iOS shell on a desktop
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // Tell first-time visitors how to get out, shortly after the app settles
  useEffect(() => {
    if (!appId || hintsShown() >= HINT_LIMIT) return;
    const show = setTimeout(() => {
      setHint(true);
      markHintShown();
    }, 700);
    const hide = setTimeout(() => setHint(false), 5200);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [appId]);

  if (!appId) return null;

  const def = IOS_APPS[appId];
  const Content = def.component;
  const inset = def.inset !== false;
  const zoomed = phase === "app";

  const vw = typeof window === "undefined" ? 390 : window.innerWidth;
  const vh = typeof window === "undefined" ? 844 : window.innerHeight;
  const ox = origin ? origin.x + origin.w / 2 : vw / 2;
  const oy = origin ? origin.y + origin.h / 2 : vh / 2;
  const shrink = origin ? Math.max(0.12, origin.w / vw) : 0.88;

  const endDrag = (commit: boolean) => {
    start.current = null;
    setDragging(false);
    setDrag(0);
    if (commit) close();
  };

  const scale = zoomed ? 1 - 0.16 * drag : shrink;
  const radius = zoomed ? Math.min(44, 44 * drag * 1.6) : 44;

  return (
    <div
      className="fixed inset-0 z-[300]"
      style={{ pointerEvents: phase === "closing" ? "none" : "auto" }}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background: def.bg ?? "var(--content-bg)",
          transformOrigin: `${ox}px ${oy}px`,
          transform: `scale(${scale})`,
          opacity: zoomed ? 1 : 0,
          borderRadius: radius,
          transition: dragging
            ? "none"
            : phase === "closing"
              ? "transform 0.24s cubic-bezier(0.4, 0, 0.8, 0.4), opacity 0.22s ease-in, border-radius 0.24s ease"
              : "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.22s ease-out, border-radius 0.4s ease",
        }}
      >
        <div
          className="flex h-full flex-col"
          style={{
            paddingTop: inset ? `calc(${STATUS_BAR_H}px + env(safe-area-inset-top, 0px))` : 0,
            paddingBottom: inset ? `calc(${INDICATOR_AREA}px + env(safe-area-inset-bottom, 0px))` : 0,
          }}
        >
          <div className="min-h-0 flex-1">
            <Content />
          </div>
        </div>

        {/* First-run coach mark, just above the indicator */}
        {hint && (
          <div
            className="anim-fade-in pointer-events-none absolute left-1/2 z-[11] w-max -translate-x-1/2 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium text-white"
            style={{
              bottom: `calc(42px + env(safe-area-inset-bottom, 0px))`,
              background: "rgba(0,0,0,0.66)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            }}
          >
            <span className="inline-flex items-center gap-1.5">
              <svg width="11" height="12" viewBox="0 0 11 12" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5.5 11 V2" />
                <path d="M1.8 5.4 L5.5 1.6 L9.2 5.4" />
              </svg>
              Swipe up or tap the bar to close
            </span>
          </div>
        )}

        {/* Home indicator: tap, click, or swipe up to leave the app */}
        <button
          aria-label={`Close ${def.label} and go to the home screen`}
          title="Swipe up or tap to close"
          className="ios-home-grab absolute bottom-0 left-1/2 z-[10] flex -translate-x-1/2 items-end justify-center"
          style={{
            // centred rather than full width, so an edge-to-edge app's own tab
            // bar stays tappable on either side of the indicator
            width: 220,
            height: `calc(38px + env(safe-area-inset-bottom, 0px))`,
            paddingBottom: `calc(8px + env(safe-area-inset-bottom, 0px))`,
            touchAction: "none",
            cursor: dragging ? "grabbing" : "pointer",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              close();
            }
          }}
          onPointerDown={(e) => {
            setHint(false);
            start.current = { y: e.clientY, moved: 0 };
            setDragging(true);
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const s = start.current;
            if (!s) return;
            const dy = s.y - e.clientY;
            s.moved = Math.max(s.moved, Math.abs(dy));
            setDrag(Math.max(0, Math.min(1, dy / SWIPE_RANGE)));
          }}
          onPointerUp={(e) => {
            const s = start.current;
            if (!s) return;
            e.currentTarget.releasePointerCapture?.(e.pointerId);
            const tapped = s.moved < TAP_SLOP;
            endDrag(tapped || (s.y - e.clientY) / SWIPE_RANGE > SWIPE_COMMIT);
          }}
          onPointerCancel={() => endDrag(false)}
        >
          <span
            className={`ios-home-indicator${hint ? " ios-home-indicator-pulse" : ""}`}
            style={{
              width: 140,
              height: 5,
              borderRadius: 3,
              background: tint === "light" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.4)",
            }}
          />
        </button>
      </div>
    </div>
  );
}
