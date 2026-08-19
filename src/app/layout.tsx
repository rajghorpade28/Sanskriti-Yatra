import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/BottomNav";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#e86b32',
}

export const metadata: Metadata = {
  title: "Sanskriti Yatra",
  description: "Explore. Learn. Preserve. Discover Maharashtra's Living Heritage.",
  applicationName: "Sanskriti Yatra",
  keywords: ["heritage", "Maharashtra", "Ellora", "Paithan", "cultural", "India"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-20">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
