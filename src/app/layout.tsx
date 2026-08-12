import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Pranav Cavaturu",
  description:
    "Pranav Cavaturu is a full-stack engineer and founder building AI tools for filmmakers. An interactive macOS-style portfolio.",
  openGraph: {
    title: "Pranav Cavaturu",
    description:
      "Full-stack engineer & founder building AI tools for filmmakers. Explore the portfolio like an operating system.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
