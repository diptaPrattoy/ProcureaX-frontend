import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "ProcuraX — Procurement, perfectly aligned",
    template: "%s | ProcuraX",
  },
  description:
    "A modern B2B procurement platform connecting buyers, suppliers, and administrators from sourcing through secure settlement.",
  applicationName: "ProcuraX",
  keywords: ["procurement", "RFQ", "supplier management", "purchase orders", "B2B"],
  openGraph: {
    title: "ProcuraX — Procurement, perfectly aligned",
    description:
      "One accountable workspace for sourcing, quotations, purchase orders, receiving, invoicing, and settlement.",
    type: "website",
    siteName: "ProcuraX",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProcuraX — Procurement, perfectly aligned",
    description: "Move every purchase from sourcing to settlement with clarity.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
