import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buried Sun — The Outer Ward",
  description: "Keep the lamps burning. An incremental game of civic duty and buried things.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Buried Sun", statusBarStyle: "default" },
  icons: { icon: "/icons/lamp.svg", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171c1a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
