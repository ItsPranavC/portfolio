"use client";

import { useSyncExternalStore } from "react";
import { IPhone } from "./ios/IPhone";
import { MacOS } from "./os/MacOS";

/**
 * Picks the shell: phones get the iOS 26 imitation, everything else (desktops,
 * laptops, tablets) keeps the macOS Tahoe desktop.
 *
 * Detection runs once at mount — screen minor axis, pointer coarseness and UA
 * are all stable for the lifetime of a page view. `?ios=1` / `?ios=0` forces a
 * shell, which is how the phone version gets previewed on a desktop.
 */
type Shell = "mac" | "ios";

function detect(): Shell {
  try {
    const forced = new URLSearchParams(window.location.search).get("ios");
    if (forced === "1" || forced === "true") return "ios";
    if (forced === "0" || forced === "false") return "mac";

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // iPad mini is 744pt on its minor axis; the largest iPhones are ~440pt
    const minorAxis = Math.min(window.screen.width, window.screen.height);
    const phoneUA = /iPhone|Android.+Mobile/.test(navigator.userAgent);
    return (coarse && minorAxis < 700) || phoneUA ? "ios" : "mac";
  } catch {
    // no matchMedia / ancient browser: behave exactly as before
    return "mac";
  }
}

/** Detection is a client-only value, so the server snapshot has no shell yet. */
const noSubscribe = () => () => {};
const noShell = () => null;

export function Device() {
  const shell = useSyncExternalStore<Shell | null>(noSubscribe, detect, noShell);

  // One frame of black before the shell resolves; both shells boot from dark,
  // so nothing flashes.
  if (!shell) return <div className="fixed inset-0" style={{ background: "#000" }} />;
  return shell === "ios" ? <IPhone /> : <MacOS />;
}
