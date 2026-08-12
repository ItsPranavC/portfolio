"use client";

import { useState } from "react";
import { projects, type Project } from "@/data/resume";
import { useOS, type AppId } from "@/system/store";
import { APPS } from "@/system/apps";
import { GlassButton } from "./AboutApp";

function ProjectGlyph({ project, size, radius }: { project: Project; size: number; radius: number }) {
  if (project.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={project.image} alt="" width={size} height={size} draggable={false} />;
  }
  return (
    <span
      className="flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        fontSize: size * 0.46,
        background: `linear-gradient(160deg, ${project.color}, ${project.color}cc)`,
        boxShadow: `0 ${size * 0.16}px ${size * 0.4}px ${project.color}55, inset 0 1px 2px rgba(255,255,255,0.5)`,
      }}
    >
      {GLYPHS[project.icon]}
    </span>
  );
}

const GLYPHS: Record<Project["icon"], string> = {
  film: "🎬",
  heart: "🫶",
  map: "🗺️",
  pen: "✍️",
};

export function ProjectsApp() {
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const project = projects.find((p) => p.id === selectedId)!;

  return (
    <div className="flex h-full">
      {/* Finder-style sidebar */}
      <div
        className="w-52 flex-none border-r px-2.5 py-3"
        style={{ background: "var(--sidebar-bg)", borderColor: "var(--divider)" }}
      >
        <div
          className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: "var(--text-tertiary)" }}
        >
          Projects
        </div>
        {projects.map((p) => (
          <button
            key={p.id}
            className="mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px] font-medium"
            style={{
              background: p.id === selectedId ? "rgba(10,132,255,0.85)" : "transparent",
              color: p.id === selectedId ? "#fff" : "var(--text-primary)",
            }}
            onClick={() => setSelectedId(p.id)}
          >
            <span className="flex h-6 w-6 flex-none items-center justify-center">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" width={24} height={24} draggable={false} />
              ) : (
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md text-[13px]"
                  style={{ background: p.color, boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)" }}
                >
                  {GLYPHS[p.icon]}
                </span>
              )}
            </span>
            <span className="truncate">{p.name}</span>
          </button>
        ))}
      </div>

      {/* Detail pane */}
      <div className="macos-scroll flex-1 px-8 py-6" style={{ background: "var(--content-bg)" }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <ProjectGlyph project={project} size={48} radius={12} />
            <div>
              <h2 className="text-[22px] font-bold tracking-tight">{project.name}</h2>
              <div className="text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
                {project.year}
              </div>
            </div>
          </div>
          {APPS[project.id as AppId] && (
            <GlassButton primary onClick={() => useOS.getState().openApp(project.id as AppId)}>
              Open {project.name} ▸
            </GlassButton>
          )}
        </div>

        <p className="mt-4 text-[14.5px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {project.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((t) => (
            <span
              key={t}
              className="rounded-md px-2 py-0.5 font-mono text-[11.5px]"
              style={{
                background: `${project.color}18`,
                color: project.color,
                border: `0.5px solid ${project.color}40`,
                fontFamily: "var(--font-mono)",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div
          className="mt-6 border-t pt-4 text-[11px] font-semibold uppercase tracking-[0.08em]"
          style={{ borderColor: "var(--divider)", color: "var(--text-tertiary)" }}
        >
          Highlights
        </div>
        <ul className="mt-3 space-y-3 pb-4">
          {project.bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-[13.5px] leading-relaxed">
              <span
                className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full"
                style={{ background: project.color }}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div
          className="mb-2 rounded-xl px-4 py-3 text-[12.5px]"
          style={{ background: "var(--sidebar-bg)", color: "var(--text-secondary)", border: "0.5px solid var(--divider)" }}
        >
          {project.url || APPS[project.id as AppId]
            ? `✦ ${project.name} is live${project.url ? ` at ${project.url.replace("https://", "")}` : " as an iOS app"}. Launch it right from this OS with the button above.`
            : "🚧 A live in-OS demo of this project is coming soon."}
        </div>
      </div>
    </div>
  );
}
