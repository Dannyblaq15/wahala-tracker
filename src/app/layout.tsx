import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/NotificationProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Wahala Tracker | Manage Your Daily Stress",
  description: "A premium Nigerian-style issue tracking system to log your daily challenges and monitor your mood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
