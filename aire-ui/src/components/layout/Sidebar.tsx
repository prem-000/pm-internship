"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, Brain, Sparkles, Briefcase, Settings, Globe, LogOut, Bolt } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";

// Initialize i18n
import "@/lib/i18n";
import { useTranslation } from "react-i18next";

const mainNav = [
  { href: "/", i18nKey: "dashboard", icon: LayoutDashboard },
  { href: "/profile", i18nKey: "my_profile", icon: User },
  { href: "/skill-gap", i18nKey: "skill_gap", icon: Brain },
  { href: "/recommendations", i18nKey: "recommendations", icon: Sparkles },
];

const secondaryNav = [
  { href: "/settings", i18nKey: "settings", icon: Settings },
];

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'HI' },
  { code: 'ta', label: 'TA' },
  { code: 'te', label: 'TE' },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Wait until mounted to access i18n
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleLanguage = () => {
    const currentIndex = LANGUAGES.findIndex(l => l.code === i18n.language);
    const nextIndex = (currentIndex + 1) % LANGUAGES.length;
    i18n.changeLanguage(LANGUAGES[nextIndex].code);
  };

  const currentLangLabel = LANGUAGES.find(l => l.code === i18n.language)?.label || 'EN';

  const handleLogout = () => {
    useUserStore.getState().logout();
  };

  if (!mounted) return null; // Prevent hydration mismatch with translations

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] border-r border-sidebar-border bg-sidebar text-white pt-6 pb-4 flex flex-col transition-transform">
      <div className="flex items-center gap-3 px-6 mb-8">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <Bolt className="size-5 text-white" />
        </div>
        <span className="text-xl font-black tracking-tight text-white">AIRE</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {mainNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all",
                isActive
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="size-5" />
              {t(item.i18nKey)}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 space-y-1">
        {secondaryNav.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all text-slate-400 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="size-5" />
              {t(item.i18nKey)}
            </Link>
          );
        })}

        <button 
          onClick={toggleLanguage}
          className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-all text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <div className="flex items-center gap-3">
            <Globe className="size-5 group-hover:rotate-12 transition-transform" />
            {t('language')}
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white tracking-widest uppercase flex flex-col items-center leading-none justify-center group-active:scale-95 transition-transform">
            {currentLangLabel} <span className="text-[8px] opacity-70">▼</span>
          </span>
        </button>

        <button 
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all text-slate-400 hover:bg-red-500/10 hover:text-red-400 mt-2"
        >
          <LogOut className="size-5" />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
}
