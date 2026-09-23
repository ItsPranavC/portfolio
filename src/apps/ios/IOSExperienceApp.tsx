"use client";

import { useState } from "react";
import { experience, skills, type Experience } from "@/data/resume";
import { IOSScreen, NavBar, useIOSTheme } from "./ios-ui";

/** Notes-style presentation of the Experience app. */

type Selection = { kind: "job"; job: Experience } | { kind: "skills" };

function CompanyMark({ job, size }: { job: Experience; size: number }) {
  if (job.logo) {
    return (
      <span
        className="flex flex-none items-center justify-center overflow-hidden"
        style={{ width: size, height: size, borderRadius: size * 0.24, background: "#fff" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={job.logo} alt="" width={size} height={size} draggable={false} style={{ objectFit: "contain" }} />
      </span>
    );
  }
  return (
    <span
      className="flex flex-none items-center justify-center text-[17px] font-bold text-white"
      style={{ width: size, height: size, borderRadius: size * 0.24, background: job.color }}
    >
      {job.company[0]}
    </span>
  );
}

export function IOSExperienceApp() {
  const t = useIOSTheme();
  const [selected, setSelected] = useState<Selection | null>(null);

  if (selected?.kind === "job") {
    const job = selected.job;
    return (
      <div className="flex h-full flex-col" style={{ background: t.screen, color: t.label }}>
        <NavBar title={job.company} backLabel="Experience" onBack={() => setSelected(null)} />
        <div className="ios-scroll min-h-0 flex-1 px-5">
          <div className="flex items-center gap-3 pt-5">
            <CompanyMark job={job} size={48} />
            <div className="min-w-0">
              <div className="text-[22px] font-bold leading-tight tracking-[-0.4px]">{job.company}</div>
              <div className="text-[14px]" style={{ color: t.secondary }}>
                {job.period} · {job.location}
              </div>
            </div>
          </div>
          <div className="pt-4 text-[17px] font-semibold" style={{ color: job.color }}>
            {job.role}
          </div>
          <ul className="pt-2">
            {job.bullets.map((b, i) => (
              <li key={i} className="flex gap-2.5 py-2 text-[15px] leading-relaxed">
                <span style={{ color: t.tertiary }}>—</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div style={{ height: 28 }} />
        </div>
      </div>
    );
  }

  if (selected?.kind === "skills") {
    return (
      <div className="flex h-full flex-col" style={{ background: t.screen, color: t.label }}>
        <NavBar title="Technical Skills" backLabel="Experience" onBack={() => setSelected(null)} />
        <div className="ios-scroll min-h-0 flex-1 px-5">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group} className="pt-5">
              <div className="text-[13px] font-semibold uppercase tracking-[0.05em]" style={{ color: t.secondary }}>
                {group}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {items.map((s) => (
                  <span
                    key={s}
                    className="rounded-full px-2.5 py-1 text-[13px] font-medium"
                    style={{ background: t.fill }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div style={{ height: 28 }} />
        </div>
      </div>
    );
  }

  return (
    <IOSScreen title="Experience" subtitle={`${experience.length} roles`}>
      <div className="mt-2 px-4">
        <div className="overflow-hidden rounded-[14px]" style={{ background: t.card }}>
          {experience.map((job, i) => (
            <button
              key={job.id}
              onClick={() => setSelected({ kind: "job", job })}
              className="ios-row flex w-full items-center gap-3 py-3 pr-4 text-left"
              style={{
                borderTop: i === 0 ? "none" : `0.5px solid ${t.separator}`,
                marginLeft: i === 0 ? 0 : 14,
                paddingLeft: i === 0 ? 14 : 0,
              }}
            >
              <CompanyMark job={job} size={42} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[16.5px] font-semibold">{job.company}</span>
                <span className="block truncate text-[13.5px]" style={{ color: t.secondary }}>
                  {job.role}
                </span>
                <span className="block text-[12.5px]" style={{ color: t.tertiary }}>
                  {job.period}
                </span>
              </span>
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none" stroke={t.tertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                <path d="M1.5 1.5 L6.5 6.5 L1.5 11.5" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 px-4">
        <div className="overflow-hidden rounded-[14px]" style={{ background: t.card }}>
          <button
            onClick={() => setSelected({ kind: "skills" })}
            className="ios-row flex w-full items-center gap-3 px-4 py-3.5 text-left"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[16.5px] font-semibold">Technical Skills</span>
              <span className="block text-[13px]" style={{ color: t.secondary }}>
                Languages, frameworks, cloud, tools
              </span>
            </span>
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" stroke={t.tertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
              <path d="M1.5 1.5 L6.5 6.5 L1.5 11.5" />
            </svg>
          </button>
        </div>
      </div>
    </IOSScreen>
  );
}
