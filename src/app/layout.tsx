import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NotificationProvider } from "@/components/NotificationProvider";
import Header from "@/components/Header";
import RegisterSW from "@/components/RegisterSW";

export const viewport: Viewport = {
  themeColor: "#6B21A8",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Wahala Tracker | Manage Your Daily Stress",
  description: "A premium Nigerian-style issue tracking system to log your daily challenges and monitor your mood.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wahala Tracker",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RegisterSW />
        <Header />
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
