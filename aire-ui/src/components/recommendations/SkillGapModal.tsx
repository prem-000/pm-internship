"use client";

import { X, Loader2, Zap, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useRecommendationStore } from "@/store/recommendationStore";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

interface SkillGapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SkillGapModal({ isOpen, onClose }: SkillGapModalProps) {
  const { skillGapReport, isGapLoading, error } = useRecommendationStore();
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white/95 w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Decor */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-blue-400 to-indigo-500"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full transition-all z-10"
        >
          <X className="size-5" />
        </button>

        <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {isGapLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="size-12 text-primary animate-spin" />
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Analyzing Skill Gaps</h3>
                <p className="text-slate-500 font-medium">Comparing your profile with role requirements...</p>
              </div>
            </div>
          ) : error ? (
            <div className="py-12 flex flex-col items-center text-center space-y-4">
              <div className="size-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="size-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Analysis Failed</h3>
                <p className="text-slate-500">{error}</p>
              </div>
              <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-semibold">Close</button>
            </div>
          ) : skillGapReport ? (
            <div className="space-y-8">
              {/* Profile Intro */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-full">
                    Analysis Report
                  </span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 leading-none tracking-tight">
                  {skillGapReport.internship.title}
                </h2>
                <p className="text-slate-500 mt-2 font-medium">Deep dive into your compatibility for this position.</p>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Your Skills */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <CheckCircle2 className="size-4 text-green-500" />
                    {t('matched_skills')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skillGapReport.user_skills.length > 0 ? (
                      skillGapReport.user_skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-green-50 text-green-700 text-[13px] font-bold rounded-lg border border-green-100">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400 italic">No matches found yet.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Zap className="size-4 text-amber-500" />
                    {t('missing_skills')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skillGapReport.missing_skills.skills.length > 0 ? (
                      skillGapReport.missing_skills.skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-[13px] font-bold rounded-lg border border-slate-200">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-green-600 font-bold underline underline-offset-4 decoration-green-200 decoration-2">
                        {t('no_gaps')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Explanation Box */}
              <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 p-6 rounded-3xl border border-indigo-100/50 relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="size-4 text-primary" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">{t('ai_insight')}</h4>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {skillGapReport.explanation.gemini_text}
                </p>
              </div>

              {/* Action */}
              <div className="pt-4">
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                  Understood
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
