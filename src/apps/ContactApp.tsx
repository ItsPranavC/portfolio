"use client";

import { useState } from "react";
import { profile } from "@/data/resume";
import { useOS } from "@/system/store";
import { GlassButton } from "./AboutApp";

type SendState = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactApp() {
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("Hey Pranav, let's talk");
  const [body, setBody] = useState("");
  const [state, setState] = useState<SendState>("idle");

  const valid = EMAIL_RE.test(from) && subject.trim() && body.trim();

  const mailtoFallback = () => {
    const url = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `From: ${from}\n\n${body}`
    )}`;
    window.location.href = url;
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
      if (res.ok) {
        setState("sent");
      } else {
        throw new Error("send failed");
      }
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div
        className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center"
        style={{ background: "var(--content-bg)" }}
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "rgba(48,209,88,0.15)" }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30d158" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5 L9.5 18 L20 6.5" />
          </svg>
        </div>
        <div className="text-[17px] font-semibold">Message sent</div>
        <p className="max-w-sm text-[13px]" style={{ color: "var(--text-secondary)" }}>
          Thanks for reaching out. Pranav will get back to you at{" "}
          <span className="font-medium">{from}</span>.
        </p>
        <GlassButton
          onClick={() => {
            setBody("");
            setState("idle");
          }}
        >
          Write another
        </GlassButton>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col" style={{ background: "var(--content-bg)" }}>
      {/* Mail-style header fields */}
      <div className="flex-none px-5 pt-3 text-[13px]">
        <Field label="To:">
          <span
            className="rounded-full px-2.5 py-0.5 text-[12.5px] font-medium text-white"
            style={{ background: "var(--accent)" }}
          >
            {profile.name} &lt;{profile.email}&gt;
          </span>
        </Field>
        <Field label="From:">
          <input
            type="email"
            className="w-full bg-transparent outline-none"
            placeholder="your@email.com"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={{
              color:
                from && !EMAIL_RE.test(from) ? "#ff453a" : "var(--text-primary)",
            }}
          />
        </Field>
        <Field label="Subject:">
          <input
            className="w-full bg-transparent font-medium outline-none"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ color: "var(--text-primary)" }}
          />
        </Field>
      </div>

      <textarea
        className="macos-scroll min-h-0 flex-1 resize-none bg-transparent px-5 py-3 text-[13.5px] leading-relaxed outline-none"
        placeholder="Write something… internships, collabs, film-tech ideas, or just say hi."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{ color: "var(--text-primary)" }}
      />

      {state === "error" && (
        <div
          className="mx-4 mb-2 flex-none rounded-lg px-3 py-2 text-[12.5px]"
          style={{ background: "rgba(255,69,58,0.12)", color: "#ff453a" }}
        >
          Couldn&apos;t send from here.{" "}
          <button className="font-semibold underline" onClick={mailtoFallback}>
            Open in your Mail app instead
          </button>
        </div>
      )}

      <div
        className="flex flex-none items-center justify-between border-t px-4 py-3"
        style={{ borderColor: "var(--divider)" }}
      >
        <div className="flex gap-3 text-[12.5px]">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            LinkedIn ↗
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            GitHub ↗
          </a>
          <button
            className="font-medium hover:underline"
            style={{ color: "var(--accent)" }}
            onClick={() => useOS.getState().openApp("calendar")}
          >
            Schedule a call ↗
          </button>
        </div>
        <div style={{ opacity: valid ? 1 : 0.5, pointerEvents: valid ? "auto" : "none" }}>
          <GlassButton primary onClick={send}>
            {state === "sending" ? "Sending…" : "Send ✈"}
          </GlassButton>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-2 border-b py-2"
      style={{ borderColor: "var(--divider)" }}
    >
      <span className="w-14 flex-none" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </span>
      {children}
    </div>
  );
}
