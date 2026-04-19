import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pixel = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400"],
});

const terminal = VT323({
  variable: "--font-terminal",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "ExpansionOS | Pixel Command",
  description: "Pixel-art styled showcase for ExpansionOS for hackathon judges.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${pixel.variable} ${terminal.variable}`}>
      <body>{children}</body>
    </html>
  );
}
