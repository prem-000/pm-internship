"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Briefcase, ArrowUpRight, TrendingUp, Loader2 } from "lucide-react";
import { useRecommendationStore, Recommendation } from "@/store/recommendationStore";
import { SkillGapModal } from "@/components/recommendations/SkillGapModal";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

export default function RecommendationsPage() {
  const { recommendations, isLoading, error, fetchRecommendations, fetchSkillGap, clearSkillGap } = useRecommendationStore();
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleCardClick = (internshipId: string) => {
    fetchSkillGap(internshipId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    clearSkillGap();
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader 
        title={t('recommendations')} 
        subtitle={t('rec_subtitle')} 
      />

      <SkillGapModal 
        isOpen={modalOpen} 
        onClose={closeModal} 
      />

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-8 text-primary animate-spin" />
          <p className="text-slate-500 mt-4 font-medium">{t('finding_matches')}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg font-medium border border-red-200">
          {error}
        </div>
      )}

      {!isLoading && !error && recommendations.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          {t('no_recs')}
        </div>
      )}

      {!isLoading && recommendations.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec: Recommendation) => {
            const isHighMatch = rec.score >= 80;
            return (
              <Card 
                key={rec.internship_id} 
                onClick={() => handleCardClick(rec.internship_id)}
                className="flex flex-col h-full border-t-4 hover:border-t-primary transition-all hover:bg-slate-50/50 cursor-pointer hover:shadow-lg hover:-translate-y-1 duration-300"
              >
                <CardContent className="flex flex-col flex-1 p-5 gap-4">
                  
                  <div className="flex items-start justify-between">
                    <div className="size-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                      <Briefcase className="size-6 text-slate-500" />
                    </div>
                    {isHighMatch && (
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                        <TrendingUp className="size-3" />
                        {t('high_match')}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-foreground leading-tight tracking-tight">{rec.title}</h3>
                    <p className="text-sm font-medium text-slate-500">{rec.organization || rec.company || "AIRE Partner"} • {rec.location || "Remote"}</p>
                  </div>

                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-600">{t('skill_matches')}</span>
                      <span className={isHighMatch ? "text-green-600 font-bold" : "text-primary font-bold"}>
                        {rec.score}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isHighMatch ? 'bg-green-500' : 'bg-primary'}`} 
                        style={{ width: `${rec.score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <span className="text-xs font-semibold text-slate-500 block">{t('req_skills')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(rec.match_details?.matched_skills || []).map((skill: string) => (
                        <span key={skill} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-[6px] border border-green-200">
                          {skill}
                        </span>
                      ))}
                      {(rec.match_details?.missing_skills || []).map((skill: string) => (
                        <span key={skill} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-semibold rounded-[6px]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      rec.apply_url && rec.apply_url !== '#' && window.open(rec.apply_url, '_blank');
                    }}
                    className="w-full mt-2 bg-primary/10 text-primary hover:bg-primary hover:text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {t('apply')} <ArrowUpRight className="size-4" />
                  </button>

                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
