"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Briefcase, Brain, Sparkles, User, ArrowUpRight, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/store/userStore";
import { useRecommendationStore } from "@/store/recommendationStore";
import { useAnalyticsStore } from "@/store/analyticsStore";
import "@/lib/i18n";

export default function Dashboard() {
  const { profile, fetchProfile } = useUserStore();
  const { recommendations, fetchRecommendations, isLoading: isRecLoading } = useRecommendationStore();
  const { data: analytics, fetchAnalytics, isLoading: isAnalyticsLoading } = useAnalyticsStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchProfile();
    fetchRecommendations();
    fetchAnalytics();
  }, [fetchProfile, fetchRecommendations, fetchAnalytics]);

  const profileStrength = profile?.profile_strength || 0;
  const topRecs = recommendations.slice(0, 5);
  const sectors = analytics?.sectorDistribution?.sectors || [];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader 
        title={t('dashboard')} 
        subtitle={`${t('welcome_back')}${profile?.full_name ? ', ' + profile.full_name : ''}. ${t('insights_subtitle')}`} 
      />

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary text-white border-transparent shadow-[0_8px_30px_rgb(59,130,246,0.3)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/80">{t('profile_strength')}</CardTitle>
            <User className="size-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileStrength}%</div>
            <p className="text-xs text-white/80 mt-1 flex items-center gap-1">
              <TrendingUp className="size-3" /> {t('updated_recently')}
            </p>
            <div className="mt-4 h-2 w-full bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${profileStrength}%` }}></div>
            </div>
          </CardContent>
        </Card>

        {/* Best Match Score */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('skill_matches')}</CardTitle>
            <Brain className="size-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isRecLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : recommendations.length > 0 ? (
                `${Math.round(recommendations[0]?.score || 0)}%`
              ) : (
                "—"
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">{t('matched_roles')} · top match</p>
          </CardContent>
        </Card>

        {/* High-Match Opportunities */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('growth')}</CardTitle>
            <TrendingUp className="size-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isRecLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                recommendations.filter((r) => r.score >= 70).length
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">High-match roles (≥70%)</p>
          </CardContent>
        </Card>

        {/* Skills Identified */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('skills_identified')}</CardTitle>
            <Sparkles className="size-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {profile?.skills?.length || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">{t('verified_profile')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Internships */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold tracking-tight text-slate-800">{t('recommended_internships')}</h2>
            <Link href="/recommendations" className="text-sm text-primary hover:underline font-bold">{t('view_all')}</Link>
          </div>
          <div className="grid gap-4">
            {isRecLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="size-6 text-primary animate-spin" />
              </div>
            ) : topRecs.length > 0 ? (
              topRecs.map((rec) => (
                <Card key={rec.internship_id} className="flex flex-col sm:flex-row gap-4 p-4 border-l-4 border-l-primary hover:bg-slate-50/50 group transition-all cursor-pointer border-border/50 shadow-sm hover:shadow-md">
                  <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <Briefcase className="size-6 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{rec.title}</h3>
                    <p className="text-sm font-medium text-slate-500">{rec.organization || rec.company || "AIRE Partner"} • {rec.location || "Remote"}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-wider border border-green-100">{rec.score}% {t('match')}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => rec.apply_url && rec.apply_url !== '#' && window.open(rec.apply_url, '_blank')}
                    className="sm:self-center bg-primary text-white hover:bg-blue-600 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                  >
                    {t('apply')} <ArrowUpRight className="size-3.5" />
                  </button>
                </Card>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-10 text-center font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">{t('no_recs_yet')}</p>
            )}
          </div>
        </div>

        {/* Skill Gap Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold tracking-tight text-slate-800">{t('sector_distribution')}</h2>
            <Link href="/skill-gap" className="text-sm text-primary hover:underline font-bold">{t('view_all')}</Link>
          </div>
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-700">{t('top_sectors')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAnalyticsLoading ? (
                <div className="flex justify-center py-4">
                   <Loader2 className="size-5 text-primary animate-spin" />
                </div>
              ) : sectors.length ? (
                sectors.map((s: any) => (
                  <div key={s.name} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-600">{s.name}</span>
                      <span className="text-primary font-black">{s.percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-1000" style={{ width: `${s.percentage}%` }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic text-center py-4">{t('start_browsing')}</p>

)}
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-none text-white relative overflow-hidden group shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent pointer-events-none group-hover:opacity-100 transition-opacity opacity-50"></div>
            <CardContent className="p-5 flex gap-4 items-center relative z-10">
              <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-transform">
                <Brain className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">{t('ai_insights_active')}</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{t('optimizing_profile')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
