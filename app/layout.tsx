import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beef With Bezos | Amazon Missed Delivery Tracker",
  description: "Tracking every time Amazon fails to deliver. One missed package at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="animated-gradient min-h-screen">{children}</body>
    </html>
  );
}
