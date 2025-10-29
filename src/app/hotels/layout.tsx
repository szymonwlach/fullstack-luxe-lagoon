"use client";
import { usePathname } from "next/navigation";

export default function PodstronaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div
      className={`relative ${isHome ? "" : "bg-slate-800 min-h-screen pt-20"}`}
    >
      {children}
    </div>
  );
}
