import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import "./admin.css";

const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Solavéra Hotel | Where the Sun Meets Serenity",
  description: "Experience island luxury at Solavéra Hotel, a tropical beachfront escape with refined rooms, ocean views, and unforgettable moments.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Admin routes are intentionally unauthenticated for demonstration purposes and must be protected before production use.
  return <html lang="en" data-scroll-behavior="smooth"><body className={`${display.variable} ${body.variable}`}>{children}</body></html>;
}
