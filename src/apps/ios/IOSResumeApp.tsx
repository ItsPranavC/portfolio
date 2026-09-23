"use client";

import { IOSButton, useIOSTheme } from "./ios-ui";

/**
 * iOS presentation of the Resume app.
 *
 * WebKit on iOS refuses to render a PDF inside an iframe — it paints an empty
 * box — so on iOS the PDF is handed to the system viewer in a new tab instead.
 * Every other engine (desktop preview via `?ios=1`, Android Chrome) still gets
 * the inline preview.
 */
function isWebKitMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

export function IOSResumeApp() {
  const t = useIOSTheme();
  const inline = !isWebKitMobile();

  return (
    <div className="flex h-full flex-col" style={{ background: t.screen, color: t.label }}>
      <div
        className="flex flex-none items-center justify-between gap-3 px-4 py-2.5"
        style={{ borderBottom: `0.5px solid ${t.separator}` }}
      >
        <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">
          Pranav_Cavaturu_Resume.pdf
        </span>
        <a
          href="/resume.pdf"
          download="Pranav_Cavaturu_Resume.pdf"
          className="flex-none rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-white"
          style={{ background: t.blue }}
        >
          Download
        </a>
      </div>

      {inline ? (
        <div className="min-h-0 flex-1 bg-[#525659]">
          <iframe
            src="/resume.pdf#view=FitH&toolbar=0"
            title="Pranav Cavaturu Resume"
            className="h-full w-full border-0"
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
          <svg width="76" height="94" viewBox="0 0 76 94" aria-hidden>
            <path
              d="M6 4 h44 l20 20 v66 a4 4 0 0 1 -4 4 H6 a4 4 0 0 1 -4 -4 V8 a4 4 0 0 1 4 -4 Z"
              fill="#fff"
              stroke="rgba(0,0,0,0.18)"
              strokeWidth="1.5"
            />
            <path d="M50 4 l20 20 h-16 a4 4 0 0 1 -4 -4 Z" fill="#c9ccd6" />
            <g stroke="#8e8e93" strokeWidth="4" strokeLinecap="round">
              <path d="M14 40 h34" stroke="#ff453a" />
              <path d="M14 52 h48" />
              <path d="M14 63 h48" />
              <path d="M14 74 h30" />
            </g>
          </svg>
          <div>
            <div className="text-[19px] font-semibold">Resume</div>
            <p className="mt-1 text-[14px] leading-snug" style={{ color: t.secondary }}>
              iOS opens PDFs in its own viewer — tap below to read it, or download a copy.
            </p>
          </div>
          <div className="w-full">
            <IOSButton onClick={() => window.open("/resume.pdf", "_blank", "noopener")}>
              Open PDF
            </IOSButton>
          </div>
        </div>
      )}
    </div>
  );
}
