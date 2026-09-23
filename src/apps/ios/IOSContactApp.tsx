"use client";

import { useState } from "react";
import { profile } from "@/data/resume";
import { launchApp } from "@/system/os-bridge";
import { Group, IOSButton, IOSScreen, Row, useIOSTheme } from "./ios-ui";

type SendState = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** iOS presentation of the Contact app: grouped inset fields + send button. */
export function IOSContactApp() {
  const t = useIOSTheme();
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("Hey Pranav, let's talk");
  const [body, setBody] = useState("");
  const [state, setState] = useState<SendState>("idle");

  const valid = EMAIL_RE.test(from) && !!subject.trim() && !!body.trim();

  const mailtoFallback = () => {
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(`From: ${from}\n\n${body}`)}`;
  };

  const send = async () => {
    if (!valid || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, subject, message: body }),
      });
      if (!res.ok) throw new Error("send failed");
      setState("sent");
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <IOSScreen>
        <div className="flex flex-col items-center px-8 pt-16 text-center">
          <div
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full"
            style={{ background: "rgba(48,209,88,0.16)" }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#30d158" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12.5 L9.5 18 L20 6.5" />
            </svg>
          </div>
          <div className="mt-4 text-[22px] font-semibold">Message sent</div>
          <p className="mt-1 text-[15px] leading-snug" style={{ color: t.secondary }}>
            Thanks for reaching out. Pranav will reply to{" "}
            <span style={{ color: t.label }}>{from}</span>.
          </p>
          <div className="mt-6 w-full">
            <IOSButton
              tone="tinted"
              onClick={() => {
                setBody("");
                setState("idle");
              }}
            >
              Write another
            </IOSButton>
          </div>
        </div>
      </IOSScreen>
    );
  }

  const fieldStyle = {
    color: t.label,
    caretColor: t.blue,
  } as const;

  return (
    <IOSScreen title="Contact" subtitle={`Goes straight to ${profile.email}`}>
      <Group header="Your message">
        <div className="flex items-center gap-3 py-[11px] pl-4 pr-4">
          <span className="w-[68px] flex-none text-[16px]" style={{ color: t.secondary }}>
            From
          </span>
          <input
            type="email"
            inputMode="email"
            autoCapitalize="off"
            autoCorrect="off"
            className="min-w-0 flex-1 bg-transparent text-[16px] outline-none"
            placeholder="your@email.com"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={{
              ...fieldStyle,
              color: from && !EMAIL_RE.test(from) ? "#ff453a" : t.label,
            }}
          />
        </div>
        <div
          className="flex items-center gap-3 py-[11px] pr-4"
          style={{ borderTop: `0.5px solid ${t.separator}`, marginLeft: 16 }}
        >
          <span className="w-[68px] flex-none text-[16px]" style={{ color: t.secondary }}>
            Subject
          </span>
          <input
            className="min-w-0 flex-1 bg-transparent text-[16px] outline-none"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={fieldStyle}
          />
        </div>
        <div style={{ borderTop: `0.5px solid ${t.separator}`, marginLeft: 16 }}>
          <textarea
            rows={6}
            className="ios-scroll w-full resize-none bg-transparent py-3 pr-4 text-[16px] leading-relaxed outline-none"
            placeholder="Internships, collabs, film-tech ideas, or just say hi."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={fieldStyle}
          />
        </div>
      </Group>

      {state === "error" && (
        <div className="px-4 pt-4">
          <div
            className="rounded-[12px] px-4 py-3 text-[14px] leading-snug"
            style={{ background: "rgba(255,69,58,0.14)", color: "#ff453a" }}
          >
            Couldn&apos;t send from here.{" "}
            <button className="font-semibold underline" onClick={mailtoFallback}>
              Open in Mail instead
            </button>
          </div>
        </div>
      )}

      <div className="px-4 pt-4">
        <IOSButton onClick={send} disabled={!valid || state === "sending"}>
          {state === "sending" ? "Sending…" : "Send"}
        </IOSButton>
      </div>

      <Group header="Elsewhere">
        <Row
          first
          label="Schedule a call"
          accent
          chevron
          onClick={() => launchApp("calendar")}
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
      </Group>
    </IOSScreen>
  );
}
