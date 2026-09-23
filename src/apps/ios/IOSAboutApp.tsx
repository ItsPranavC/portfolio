"use client";

import { profile } from "@/data/resume";
import { launchApp } from "@/system/os-bridge";
import { AppIcon } from "@/system/icons";
import type { AppId } from "@/system/store";
import { Group, IOSScreen, Row, useIOSTheme } from "./ios-ui";

/** Contacts-style profile card: the iOS presentation of the About app. */
export function IOSAboutApp() {
  const t = useIOSTheme();

  return (
    <IOSScreen>
      <div className="flex flex-col items-center px-6 pt-4 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/profile.jpeg"
          alt={profile.name}
          className="h-[108px] w-[108px] rounded-full object-cover"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.22)" }}
          draggable={false}
        />
        <h1 className="mt-3 text-[26px] font-semibold tracking-[-0.4px]">{profile.name}</h1>
        <p className="mt-0.5 text-[15px] leading-snug" style={{ color: t.secondary }}>
          {profile.role}
        </p>
      </div>

      {/* Quick actions, like Contacts' message / call / video row */}
      <div className="mt-5 flex justify-center gap-2.5 px-4">
        <Action id="contact" label="Mail" />
        <Action id="resume" label="Resume" />
        <Action id="projects" label="Projects" />
        <Action id="experience" label="Notes" />
      </div>

      <Group header="Education">
        <Row first label="School" detail={profile.education.school} />
        <Row label="Degree" detail={profile.education.degree} />
        <Row label="Certificate" detail={profile.education.extra} />
        <Row label="Graduation" value={profile.education.grad} />
        <Row label="Location" value={profile.education.location} />
      </Group>

      <Group header="Contact">
        <Row
          first
          label="email"
          detail={profile.email}
          accent
          onClick={() => {
            window.location.href = `mailto:${profile.email}`;
          }}
        />
        <Row
          label="LinkedIn"
          accent
          chevron
          onClick={() => window.open(profile.linkedin, "_blank", "noopener")}
        />
        <Row
          label="GitHub"
          accent
          chevron
          onClick={() => window.open(profile.github, "_blank", "noopener")}
        />
        <Row label="Schedule a call" accent chevron onClick={() => launchApp("calendar")} />
      </Group>

      <Group
        footer="This whole page is an iOS 26 imitation running in the browser. On a Mac it boots as a macOS Tahoe desktop instead."
      >
        <Row first label="Settings" chevron onClick={() => launchApp("settings")} />
        <Row label="Terminal" chevron onClick={() => launchApp("terminal")} />
      </Group>
    </IOSScreen>
  );
}

function Action({ id, label }: { id: AppId; label: string }) {
  const t = useIOSTheme();
  return (
    <button
      onClick={() => launchApp(id)}
      className="flex flex-1 flex-col items-center gap-1 rounded-[12px] py-2.5 transition-transform active:scale-95"
      style={{ background: t.fill }}
    >
      <AppIcon id={id} size={26} />
      <span className="text-[11.5px] font-medium" style={{ color: t.blue }}>
        {label}
      </span>
    </button>
  );
}
