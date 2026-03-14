"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import { SkillsManager } from "@/components/profile/SkillsManager";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

export default function ProfilePage() {
  const { profile, fetchProfile, updateProfile, isLoading } = useUserStore();
  const { register, handleSubmit, reset } = useForm();
  const { t } = useTranslation();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        target_roles: profile.target_roles?.join(", ") || "",
        location_preference: profile.location_preference || "",
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        portfolio_url: profile.portfolio_url || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: any) => {
    const formattedData = {
      ...data,
      target_roles: data.target_roles.split(",").map((r: string) => r.trim()).filter(Boolean)
    };
    
    try {
      await updateProfile(formattedData);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const profileStrength = profile?.profile_strength || 0;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader 
        title={t('my_profile')} 
        subtitle={t('pref_desc')} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Form) */}
        <div className="lg:col-span-2 space-y-6">
          <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('personal_info')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">{t('full_name')}</label>
                  <input {...register("full_name")} type="text" className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-card" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">{t('email_address')}</label>
                  <input {...register("email")} type="email" disabled className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none bg-slate-50 text-slate-500 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">{t('bio')}</label>
                  <input {...register("bio")} type="text" className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-card" />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                    {isLoading ? t('saving') : t('save_changes')}
                  </button>
                </div>
              </CardContent>
            </Card>
          </form>

          <Card>
            <CardHeader>
              <CardTitle>{t('skills')}</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillsManager />
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('career_preferences')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">{t('target_roles')}</label>
                  <input {...register("target_roles")} type="text" placeholder="e.g. Machine Learning Engineer, Data Scientist" className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-card" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">{t('preferred_locations')}</label>
                  <input {...register("location_preference")} type="text" placeholder="e.g. Remote, San Francisco, New York" className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-card" />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                    {isLoading ? t('saving') : t('save_preferences')}
                  </button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Right Column (Sidebar Cards) */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary to-blue-600 text-white border-none shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-white/90 text-sm">{t('profile_strength')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black mb-2 tracking-tight">{profileStrength}%</div>
              <p className="text-sm text-blue-100 font-medium">{t('strength_msg')}</p>
              <div className="mt-4 h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${profileStrength}%` }}></div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm tracking-tight px-1">{t('resume_intel')}</h3>
            <ResumeUpload />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>{t('pro_links')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">{t('linkedin')}</label>
                  <input {...register("linkedin_url")} type="url" placeholder="https://linkedin.com/in/..." className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-card" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">{t('github')}</label>
                  <input {...register("github_url")} type="url" placeholder="https://github.com/..." className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-card" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">{t('portfolio')}</label>
                  <input {...register("portfolio_url")} type="url" placeholder="https://..." className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-card" />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={isLoading} className="w-full px-4 py-2 bg-secondary text-secondary-foreground text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50">
                    {isLoading ? t('saving') : t('save_links')}
                  </button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
