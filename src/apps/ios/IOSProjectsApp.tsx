"use client";

import { useState } from "react";
import { projects, type Project } from "@/data/resume";
import { APPS } from "@/system/apps";
import { launchApp } from "@/system/os-bridge";
import type { AppId } from "@/system/store";
import { IOSButton, IOSScreen, NavBar, useIOSTheme } from "./ios-ui";

/** iOS presentation of Projects: a list of cards that push into a detail view. */

const GLYPHS: Record<Project["icon"], string> = {
  film: "🎬",
  heart: "🫶",
  map: "🗺️",
  pen: "✍️",
};

function kindOf(p: Project): string {
  if (p.id === "b3vo" || p.id === "campus") return "iOS app";
  if (p.id === "echo") return "macOS app";
  return "Web app";
}

function runnable(p: Project): boolean {
  return !!APPS[p.id as AppId];
}

function open(p: Project) {
  if (runnable(p)) launchApp(p.id as AppId);
  else if (p.url) window.open(p.url, "_blank", "noopener");
}

function Logo({ project, size }: { project: Project; size: number }) {
  if (project.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={project.image} alt="" width={size} height={size} draggable={false} style={{ display: "block" }} />
    );
  }
  return (
    <span
      className="flex flex-none items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.23,
        fontSize: size * 0.46,
        background: `linear-gradient(160deg, ${project.color}, ${project.color}cc)`,
      }}
    >
      {GLYPHS[project.icon]}
    </span>
  );
}

export function IOSProjectsApp() {
  const t = useIOSTheme();
  const [selected, setSelected] = useState<Project | null>(null);

  if (selected) {
    return (
      <div className="flex h-full flex-col" style={{ background: t.screen, color: t.label }}>
        <NavBar title={selected.name} backLabel="Projects" onBack={() => setSelected(null)} />
        <div className="ios-scroll min-h-0 flex-1">
          <div className="flex flex-col items-center px-6 pt-5 text-center">
            <Logo project={selected} size={84} />
            <h1 className="mt-3 text-[24px] font-semibold tracking-[-0.4px]">{selected.name}</h1>
            <p className="text-[14px]" style={{ color: t.secondary }}>
              {kindOf(selected)} · {selected.year}
            </p>
          </div>

          <div className="px-4 pt-5">
            <IOSButton onClick={() => open(selected)}>
              {runnable(selected) ? "Open app" : "Open site"}
            </IOSButton>
          </div>

          <p className="px-5 pt-5 text-[15.5px] leading-relaxed">{selected.summary}</p>

          <div className="flex flex-wrap gap-1.5 px-5 pt-4">
            {selected.stack.map((s) => (
              <span
                key={s}
                className="rounded-full px-2.5 py-1 text-[12.5px] font-medium"
                style={{ background: t.fill, color: t.secondary }}
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-5 px-4">
            <div className="overflow-hidden rounded-[12px]" style={{ background: t.card }}>
              {selected.bullets.map((b, i) => (
                <div
                  key={i}
                  className="flex gap-2.5 px-4 py-3 text-[14.5px] leading-snug"
                  style={{ borderTop: i === 0 ? "none" : `0.5px solid ${t.separator}` }}
                >
                  <span style={{ color: selected.color }}>●</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 28 }} />
        </div>
      </div>
    );
  }

  return (
    <IOSScreen title="Projects" subtitle={`${projects.length} shipped`}>
      <div className="mt-2 px-4">
        <div className="overflow-hidden rounded-[14px]" style={{ background: t.card }}>
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="ios-row flex w-full items-center gap-3 py-3 pr-4 text-left"
              style={{
                borderTop: i === 0 ? "none" : `0.5px solid ${t.separator}`,
                marginLeft: i === 0 ? 0 : 14,
                paddingLeft: i === 0 ? 14 : 0,
              }}
            >
              <Logo project={p} size={54} />
              <span className="min-w-0 flex-1">
                <span className="block text-[16.5px] font-semibold">{p.name}</span>
                <span className="block text-[12.5px]" style={{ color: t.tertiary }}>
                  {kindOf(p)} · {p.year}
                </span>
                <span
                  className="mt-0.5 block text-[13.5px] leading-snug"
                  style={{
                    color: t.secondary,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {p.summary}
                </span>
              </span>
              <svg
                className="flex-none"
                width="8"
                height="13"
                viewBox="0 0 8 13"
                fill="none"
                stroke={t.tertiary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1.5 1.5 L6.5 6.5 L1.5 11.5" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </IOSScreen>
  );
}
