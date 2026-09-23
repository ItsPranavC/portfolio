"use client";

import { useEffect } from "react";
import { Wallpaper } from "@/components/os/Wallpaper";
import { IOS_APPS } from "@/system/ios-apps";
import { useIOS } from "@/system/ios-store";
import { registerLauncher } from "@/system/os-bridge";
import { useOS } from "@/system/store";
import { AppHost } from "./AppHost";
import { HomeScreen } from "./HomeScreen";
import { IOSDock } from "./IOSDock";
import { StatusBar, type StatusTint } from "./StatusBar";

/**
 * iOS 26 shell — the phone counterpart to <MacOS />.
 *
 * Appearance (dark mode, wallpaper) and the `mobile` flag stay in the macOS
 * store so reused apps (Settings, Calendar, Snake) work unmodified; only the
 * "which app is open" state lives in the iOS store.
 */
export function IPhone() {
  const dark = useOS((s) => s.dark);
  const openApp = useIOS((s) => s.openApp);
  const phase = useIOS((s) => s.phase);

  useEffect(() => {
    const os = useOS.getState();
    os.setMobile(true);
    os.setBooted(true);
    // phone default; Settings can still switch it
    if (os.wallpaper === "tahoe") os.setWallpaper("liquid");
    // cross-app opens (Terminal `open <app>`, Contact's calendar button)
    return registerLauncher((id) => useIOS.getState().open(id));
  }, []);

  const def = openApp ? IOS_APPS[openApp] : null;
  const appFront = !!def && (phase === "app" || phase === "opening");
  const tint: StatusTint = !appFront
    ? "light"
    : def!.status === "light"
      ? "light"
      : def!.status === "dark"
        ? "dark"
        : dark
          ? "light"
          : "dark";

  return (
    <div id="ios-root" className="fixed inset-0 overflow-hidden" style={{ background: "#000" }}>
      <Wallpaper />
      {/* iOS dims the wallpaper on the home screen so icon labels stay legible
          over pale artwork */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.06) 28%, rgba(0,0,0,0.04) 62%, rgba(0,0,0,0.18) 100%)",
        }}
      />
      <HomeScreen dimmed={appFront} />
      <IOSDock dimmed={appFront} />
      <AppHost tint={tint} />
      <StatusBar tint={tint} />
    </div>
  );
}
