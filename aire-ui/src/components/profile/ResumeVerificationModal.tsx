"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

interface ResumeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  parsedData: any;
}

export function ResumeVerificationModal({ isOpen, onClose, parsedData }: ResumeVerificationModalProps) {
  const { fetchProfile } = useUserStore();
  const [formData, setFormData] = useState<any>({
    full_name: "",
    education: "",
    skills: [],
    experience: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (parsedData) {
      setFormData({
        ...parsedData, // Preserve all extracted fields
        full_name: parsedData.full_name || parsedData.name || "",
        education: parsedData.education || "",
        skills: parsedData.skills || [],
        experience: parsedData.experience || [],
      });
    }
  }, [parsedData]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await api.post("/profile/confirm-resume-data", formData);
      toast.success("Profile updated from resume!");
      await fetchProfile();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to confirm resume data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-xl mx-4 rounded-[12px] shadow-lg border border-border animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold tracking-tight">Review Extracted Information</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="size-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 block">Name</label>
            <input 
              type="text" 
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-card" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 block">Education</label>
            <input 
              type="text" 
              value={formData.education}
              onChange={(e) => setFormData({...formData, education: e.target.value})}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-card" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 block">Skills</label>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill: string, idx: number) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 block">Experience Summary</label>
            <textarea 
              value={Array.isArray(formData.experience) ? formData.experience.join("\n") : formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value.split("\n")})}
              rows={4}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-card resize-none" 
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-slate-50 rounded-b-[12px]">
          <button onClick={onClose} disabled={isSubmitting} className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-sm min-w-[140px] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Confirm & Merge"}
          </button>
        </div>
      </div>
    </div>
  );
}
