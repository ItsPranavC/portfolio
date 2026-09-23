"use client";

import type { CSSProperties, ReactNode } from "react";
import { useOS } from "@/system/store";

/**
 * Shared iOS 26 UI primitives: system palette, large titles, and
 * grouped inset lists. Appearance follows `useOS.dark` so the iOS apps
 * flip with the same Settings toggle as the macOS ones.
 */

export const IOS_BLUE = "#0a84ff";

export interface IOSTheme {
  screen: string;
  card: string;
  cardPressed: string;
  label: string;
  secondary: string;
  tertiary: string;
  separator: string;
  fill: string;
  blue: string;
}

const LIGHT: IOSTheme = {
  screen: "#f2f2f7",
  card: "#ffffff",
  cardPressed: "#e5e5ea",
  label: "#000000",
  secondary: "rgba(60,60,67,0.6)",
  tertiary: "rgba(60,60,67,0.3)",
  separator: "rgba(60,60,67,0.2)",
  fill: "rgba(118,118,128,0.12)",
  blue: IOS_BLUE,
};

const DARK: IOSTheme = {
  screen: "#000000",
  card: "#1c1c1e",
  cardPressed: "#2c2c2e",
  label: "#ffffff",
  secondary: "rgba(235,235,245,0.6)",
  tertiary: "rgba(235,235,245,0.3)",
  separator: "rgba(84,84,88,0.6)",
  fill: "rgba(118,118,128,0.24)",
  blue: IOS_BLUE,
};

export function useIOSTheme(): IOSTheme {
  return useOS((s) => (s.dark ? DARK : LIGHT));
}

/** Full-height scrolling screen with an iOS large title. */
export function IOSScreen({
  title,
  subtitle,
  children,
  style,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const t = useIOSTheme();
  return (
    <div
      className="ios-scroll h-full"
      style={{ background: t.screen, color: t.label, ...style }}
    >
      {title && (
        <div className="px-4 pt-2 pb-1">
          <h1 className="text-[34px] font-bold leading-tight tracking-[-0.7px]">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-[14px]" style={{ color: t.secondary }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
      <div style={{ height: 28 }} />
    </div>
  );
}

/** Grouped inset list section. */
export function Group({
  header,
  footer,
  children,
}: {
  header?: string;
  footer?: string;
  children: ReactNode;
}) {
  const t = useIOSTheme();
  return (
    <div className="px-4 pt-5">
      {header && (
        <div
          className="px-3 pb-1.5 text-[13px] font-normal uppercase tracking-[0.04em]"
          style={{ color: t.secondary }}
        >
          {header}
        </div>
      )}
      <div className="overflow-hidden rounded-[12px]" style={{ background: t.card }}>
        {children}
      </div>
      {footer && (
        <div className="px-3 pt-1.5 text-[12.5px] leading-snug" style={{ color: t.secondary }}>
          {footer}
        </div>
      )}
    </div>
  );
}

/** One row of a grouped list. Rows separate themselves with a hairline. */
export function Row({
  label,
  value,
  detail,
  onClick,
  chevron,
  accent,
  leading,
  first,
}: {
  label: ReactNode;
  value?: ReactNode;
  detail?: ReactNode;
  onClick?: () => void;
  chevron?: boolean;
  accent?: boolean;
  leading?: ReactNode;
  first?: boolean;
}) {
  const t = useIOSTheme();
  const inner = (
    <>
      {leading && <span className="flex-none">{leading}</span>}
      <span className="min-w-0 flex-1">
        <span
          className="block truncate text-[16px]"
          style={{ color: accent ? t.blue : t.label }}
        >
          {label}
        </span>
        {detail && (
          <span className="mt-0.5 block text-[13.5px] leading-snug" style={{ color: t.secondary }}>
            {detail}
          </span>
        )}
      </span>
      {value !== undefined && (
        <span className="flex-none text-right text-[16px]" style={{ color: t.secondary }}>
          {value}
        </span>
      )}
      {chevron && (
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
      )}
    </>
  );

  const rowStyle: CSSProperties = {
    borderTop: first ? "none" : `0.5px solid ${t.separator}`,
    marginLeft: first ? 0 : 16,
    paddingLeft: first ? 16 : 0,
  };

  if (!onClick) {
    return (
      <div className="flex items-center gap-3 py-[11px] pr-4" style={rowStyle}>
        {inner}
      </div>
    );
  }
  return (
    <button
      onClick={onClick}
      className="ios-row flex w-full items-center gap-3 py-[11px] pr-4 text-left"
      style={rowStyle}
    >
      {inner}
    </button>
  );
}

/** iOS navigation bar for pushed detail views. */
export function NavBar({
  title,
  onBack,
  backLabel = "Back",
  right,
}: {
  title?: string;
  onBack: () => void;
  backLabel?: string;
  right?: ReactNode;
}) {
  const t = useIOSTheme();
  return (
    <div
      className="sticky top-0 z-10 flex h-11 flex-none items-center px-2"
      style={{
        background: t.screen,
        borderBottom: `0.5px solid ${t.separator}`,
        backdropFilter: "blur(20px)",
      }}
    >
      <button
        onClick={onBack}
        className="flex flex-none items-center gap-1 pr-2 text-[17px]"
        style={{ color: t.blue }}
      >
        <svg width="11" height="18" viewBox="0 0 11 18" fill="none" stroke={t.blue} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 1.5 L2 9 L9 16.5" />
        </svg>
        {backLabel}
      </button>
      <span className="min-w-0 flex-1 truncate text-center text-[17px] font-semibold">
        {title}
      </span>
      <span className="flex-none pl-2" style={{ minWidth: 44, textAlign: "right" }}>
        {right}
      </span>
    </div>
  );
}

/** Full-width filled iOS button. */
export function IOSButton({
  children,
  onClick,
  disabled,
  tone = "filled",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "filled" | "tinted" | "plain";
}) {
  const t = useIOSTheme();
  const style: CSSProperties =
    tone === "filled"
      ? { background: t.blue, color: "#fff" }
      : tone === "tinted"
        ? { background: t.fill, color: t.blue }
        : { background: "transparent", color: t.blue };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-[12px] px-4 py-[13px] text-[17px] font-semibold transition-transform active:scale-[0.98]"
      style={{ ...style, opacity: disabled ? 0.4 : 1 }}
    >
      {children}
    </button>
  );
}
