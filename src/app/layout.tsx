"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { FaRegClock, FaBookOpen, FaRegCalendarAlt, FaHome, FaBook } from "react-icons/fa";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navItems = [
  { href: "/", label: "Dashboard", icon: <FaHome /> },
  { href: "/prayer-times", label: "Prayer Times", icon: <FaRegClock /> },
  { href: "/quran", label: "Quran", icon: <FaBookOpen /> },
  { href: "/hadith", label: "Hadith", icon: <FaBook /> },
  { href: "/events", label: "Events", icon: <FaRegCalendarAlt /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen">
          <aside className="sidebar w-56 flex flex-col p-4 gap-2">
            <h1 className="text-2xl font-bold mb-4 text-sky-700 dark:text-emerald-300 tracking-tight">Muslim App</h1>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "sidebar-link",
                    pathname === item.href && "sidebar-link-active"
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
