import { useOS, type AppId } from "./store";

/**
 * Platform dispatcher. Apps shared between the macOS and iOS shells call
 * `launchApp` instead of `useOS.openApp`, so an app opened from inside
 * another app lands in whichever shell is actually mounted.
 *
 * The active shell registers its launcher at mount; with nothing registered
 * (the macOS shell, which needs no bridge) it falls back to the window store.
 */
type Launcher = (id: AppId) => void;

let launcher: Launcher | null = null;

/** Called by a shell at mount. Returns the matching unregister for cleanup. */
export function registerLauncher(fn: Launcher): () => void {
  launcher = fn;
  return () => {
    if (launcher === fn) launcher = null;
  };
}

export function launchApp(id: AppId): void {
  if (launcher) launcher(id);
  else useOS.getState().openApp(id);
}
