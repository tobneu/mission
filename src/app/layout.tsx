import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mission 24",
  description: "Mission 24 - A mysterious journey awaits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2a] to-[#0a0a0a] text-gray-200`}
      >
        {/* Weird navbar in the left corner */}
        <div className="fixed top-4 left-4 z-50">
          <div className="group relative">
            <div className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 animate-pulse cursor-pointer hover:scale-110 transition-transform duration-300">
              Mission 24
            </div>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
