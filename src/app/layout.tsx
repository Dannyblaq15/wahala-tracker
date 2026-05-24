import type { Metadata } from "next";
import "./globals.css";
import { NotificationProvider } from "@/components/NotificationProvider";
import Header from "@/components/Header";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
