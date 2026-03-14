"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Brain, Target, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useRecommendationStore } from "@/store/recommendationStore";
import { useUserStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

export default function SkillGapPage() {
  const { recommendations, isLoading, fetchRecommendations } = useRecommendationStore();
  const { profile } = useUserStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const topRec = recommendations[0];
  const missingSkills = topRec?.gap_analysis?.missing_skills || [];
  const matchedSkills = topRec?.match_details?.matched_skills || profile?.skills || [];
  const targetRole = topRec?.title || profile?.target_roles?.[0] || "Target Role";

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader 
        title={t('skill_gap')} 
        subtitle={t('skill_gap_desc')} 
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <Target className="size-5 text-primary" />
                {t('analysis_for')}: <span className="font-bold">{targetRole}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-6 max-w-2xl">
                {t('skill_gap_msg')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Industry Required Skills */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <Brain className="size-4 text-slate-600" />
                    <h3 className="font-semibold text-sm">{t('target_role_skills')}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[...matchedSkills, ...missingSkills].length > 0 ? (
                      [...matchedSkills, ...missingSkills].map(skill => (
                        <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No skills identified yet.</p>
                    )}
                  </div>
                </div>

                {/* Your Skills */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <h3 className="font-semibold text-sm">{t('matched_skills')}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matchedSkills.length > 0 ? (
                      matchedSkills.map(skill => (
                        <span key={skill} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No matches found.</p>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <AlertTriangle className="size-4 text-red-500" />
                    <h3 className="font-semibold text-sm text-red-600">{t('missing_skills')}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.length > 0 ? (
                      missingSkills.map(skill => (
                        <span key={skill} className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">{t('no_gaps')}</p>
                    )}
                  </div>
                </div>
              </div>

              {topRec && topRec.gap_analysis && (
                <div className="mt-8 pt-6 border-t border-border">
                  <h4 className="text-sm font-bold text-slate-700 mb-2">{t('impact_analysis')}</h4>
                  <p className="text-sm text-slate-500 mb-4">
                    {t('closing_gap_msg')} <span className="text-primary font-bold">{topRec.gap_analysis.estimated_score_if_completed}%</span>.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{t('current_score')}: {topRec.score}%</span>
                      <span className="text-primary font-semibold">{t('goal')}: {topRec.gap_analysis.estimated_score_if_completed}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${topRec.score}%` }}></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Insights Card */}
          <Card className="bg-slate-900 border-none text-white overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <Brain className="size-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold">{t('ai_skill_graph')}</h3>
                <p className="text-slate-400 text-sm mt-1 max-w-lg">
                  {t('mapping_skills')} You're {matchedSkills.length} skills away from being a top-tier candidate in {targetRole}.
                </p>
              </div>
              <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg hover:bg-blue-600 transition-all hover:scale-105">
                {t('gen_roadmap')}
              </button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
