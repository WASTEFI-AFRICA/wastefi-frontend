import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { SyncProvider } from "@/components/providers/SyncProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { OfflineIndicator } from "@/components/offline/OfflineIndicator";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WasteFi - Financial Inclusion Through Waste Collection",
  description: "Mobile-first waste banking platform for emerging markets. Powered by Open Material Standards.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WasteFi",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1b6b4a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <SyncProvider>
            <OfflineIndicator />
            <ToastProvider />
            {children}
          </SyncProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
