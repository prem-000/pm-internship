"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import "@/lib/i18n";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { fetchProfile } = useUserStore();
  
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!isAuthPage) {
      if (typeof window !== "undefined" && !localStorage.getItem("token")) {
        window.location.href = "/login";
      } else {
        fetchProfile();
      }
    }
  }, [pathname, isAuthPage, fetchProfile]);

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        {children}
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[260px]">
        <div className="mx-auto max-w-[1200px] p-6">
          {children}
        </div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
