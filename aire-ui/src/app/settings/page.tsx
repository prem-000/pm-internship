"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Settings as SettingsIcon, Bell, Globe, Shield, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();

  const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader 
        title={t('settings')} 
        subtitle={t('manage_account')} 
      />

      <div className="grid gap-6 max-w-4xl">
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border bg-slate-50/50">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Globe className="size-5 text-primary" />
              {t('language')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all shadow-sm active:scale-95 ${
                    i18n.language === lang.code 
                      ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" 
                      : "border-border bg-white text-slate-600 hover:border-primary/50 hover:bg-slate-50"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm opacity-60">
          <CardHeader className="border-b border-border bg-slate-50/50">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Bell className="size-5 text-primary" />
              {t('notifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">{t('email_notif')}</h4>
                  <p className="text-xs text-slate-500">{t('email_notif_desc')}</p>
                </div>
                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <div className="size-4 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <h4 className="font-bold text-slate-800">{t('ai_alerts')}</h4>
                  <p className="text-xs text-slate-500">{t('ai_alerts_desc')}</p>
                </div>
                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <div className="size-4 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm opacity-60">
          <CardHeader className="border-b border-border bg-slate-50/50">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Shield className="size-5 text-primary" />
              {t('security')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <button className="text-sm font-bold text-primary hover:underline">
              {t('change_password')}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
