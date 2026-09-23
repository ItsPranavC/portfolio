import type { ComponentType } from "react";
import { APPS } from "./apps";
import type { AppId } from "./store";
import { IOSAboutApp } from "@/apps/ios/IOSAboutApp";
import { IOSProjectsApp } from "@/apps/ios/IOSProjectsApp";
import { IOSExperienceApp } from "@/apps/ios/IOSExperienceApp";
import { IOSContactApp } from "@/apps/ios/IOSContactApp";
import { IOSResumeApp } from "@/apps/ios/IOSResumeApp";
import { makeIOSEmbedApp } from "@/apps/ios/IOSEmbedApp";

/**
 * How each app presents itself on the iOS shell. Four apps are restyled;
 * everything else reuses the macOS component full-screen.
 */
export interface IOSAppPresentation {
  component: ComponentType;
  /** Short home-screen / dock label (macOS window titles are too long). */
  label: string;
  /** false = content runs under the status bar, edge to edge. Default true. */
  inset?: boolean;
  /** Status bar glyph color. "auto" (default) follows dark mode. */
  status?: "light" | "dark" | "auto";
  /** Background behind the app, for apps that don't paint their own. */
  bg?: string;
}

const B3voIOSApp = makeIOSEmbedApp({
  name: "B3VO",
  src: "/b3vo",
  logo: "/icons/b3vo.svg",
});

const CampusIOSApp = makeIOSEmbedApp({
  name: "CAMPUS",
  src: "/campus",
  logo: "/icons/campus.svg",
  bg: "#ffffff",
});

/** Reuse the macOS component unchanged. */
function reuse(id: AppId, label: string, extra: Partial<IOSAppPresentation> = {}): IOSAppPresentation {
  return { component: APPS[id].component, label, ...extra };
}

export const IOS_APPS: Record<AppId, IOSAppPresentation> = {
  // The restyled apps paint the iOS grouped background, so the host paints it
  // too — otherwise the status bar and home-indicator strips seam against it.
  about: { component: IOSAboutApp, label: "About", bg: "var(--ios-screen)" },
  projects: { component: IOSProjectsApp, label: "Projects", bg: "var(--ios-screen)" },
  experience: { component: IOSExperienceApp, label: "Experience", bg: "var(--ios-screen)" },
  contact: { component: IOSContactApp, label: "Contact", bg: "var(--ios-screen)" },

  // WebKit on iOS won't render a PDF in an iframe, so Resume gets its own screen
  resume: { component: IOSResumeApp, label: "Resume", bg: "var(--ios-screen)" },

  terminal: reuse("terminal", "Terminal", { status: "light", bg: "rgb(24, 24, 30)" }),
  calendar: reuse("calendar", "Schedule"),
  settings: reuse("settings", "Settings"),
  snake: reuse("snake", "Snake", { status: "light", bg: "#4a752c" }),

  kubrick: reuse("kubrick", "Kubrick"),
  scripy: reuse("scripy", "Scripy"),
  echo: reuse("echo", "Echo"),

  b3vo: { component: B3voIOSApp, label: "B3VO", inset: false, status: "dark", bg: "#F5F0EB" },
  campus: { component: CampusIOSApp, label: "CAMPUS", inset: false, status: "dark", bg: "#ffffff" },
};

/** Dock apps (user-chosen): they appear only in the dock, not in the grid. */
export const IOS_DOCK_APPS: AppId[] = ["projects", "about", "contact", "resume"];

/** Home-screen grid order — every app that isn't in the dock. */
export const IOS_HOME_APPS: AppId[] = [
  "experience",
  "terminal",
  "calendar",
  "kubrick",
  "scripy",
  "echo",
  "b3vo",
  "campus",
  "snake",
  "settings",
];
