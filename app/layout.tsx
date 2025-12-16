import type { Metadata, Viewport } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beef With Bezos | Amazon Missed Delivery Tracker",
  description:
    "Tracking every time Amazon fails to deliver. A public record of disappointment, one missed package at a time.",
  keywords: ["Amazon", "delivery", "tracking", "missed packages", "complaints"],
  authors: [{ name: "Beef With Bezos" }],
  openGraph: {
    title: "Beef With Bezos",
    description: "Tracking every time Amazon fails to deliver.",
    type: "website",
    locale: "en_US",
    siteName: "Beef With Bezos",
  },
  twitter: {
    card: "summary",
    title: "Beef With Bezos",
    description: "Tracking every time Amazon fails to deliver.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="animated-gradient min-h-screen">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
