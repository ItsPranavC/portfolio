import { create } from "zustand";
import { useOS, type AppId } from "./store";

/**
 * iOS shell state: at most one app is open, and it is either on screen or
 * animating in/out. No window bounds, no z-order — the macOS store's job
 * doesn't exist here.
 *
 * Appearance (`dark`, `wallpaper`) deliberately stays in `useOS` as the
 * single source of truth so the reused Settings and Calendar apps keep
 * working unmodified.
 */
export type IOSPhase = "home" | "opening" | "app" | "closing";

/** Viewport rect of the tapped icon, so the app can zoom out of it. */
export interface IconOrigin {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface IOSState {
  openApp: AppId | null;
  phase: IOSPhase;
  origin: IconOrigin | null;
  open: (id: AppId, origin?: IconOrigin | null) => void;
  close: () => void;
}

/** Keep in sync with the close transition in AppHost. */
const CLOSE_MS = 240;

export const useIOS = create<IOSState>((set, get) => ({
  openApp: null,
  phase: "home",
  origin: null,

  open: (id, origin = null) => {
    const { openApp, phase } = get();
    if (openApp === id && phase === "app") return;
    // Reused apps read useOS.activeApp (Snake pauses when it isn't front-most)
    useOS.setState({ activeApp: id });
    set({ openApp: id, origin, phase: "opening" });
    // Paint once at the icon's position, then transition to full screen
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (get().phase === "opening") set({ phase: "app" });
      })
    );
  },

  close: () => {
    const { openApp, phase } = get();
    if (!openApp || phase === "closing") return;
    useOS.setState({ activeApp: null });
    set({ phase: "closing" });
    setTimeout(() => {
      if (get().phase === "closing") set({ openApp: null, origin: null, phase: "home" });
    }, CLOSE_MS);
  },
}));
