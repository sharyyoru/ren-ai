import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar, MobileNav } from "@/components/layout";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ren.Ai - AI-Powered Real Estate CRM",
  description: "Unified dashboard for UAE and international off-plan properties with deep AI automations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <div className="flex min-h-screen">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <main className="flex-1 min-h-screen pb-20 lg:pb-0">
            {children}
          </main>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
