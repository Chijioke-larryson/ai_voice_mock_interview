import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import React from "react";
import {Toaster} from "sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});



export const metadata: { title: string; description: string } = {
  title: "InterviewPrep",
  description: "An Ai-powered platform for preparing for mock Interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.className}  antialiased pattern`}
      >
        {children}
      <Toaster/>
      </body>
    </html>
  );
}
