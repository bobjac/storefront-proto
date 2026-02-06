import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Storefront PoC - AI Search",
  description: "AI-powered product search and recommendations demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
