"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

export function SkillsManager() {
  const { profile, updateProfile, isLoading } = useUserStore();
  const [skills, setSkills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { t } = useTranslation();

  // Sync state with profile
  useEffect(() => {
    if (profile?.skills) {
      setSkills(profile.skills);
    }
  }, [profile?.skills]);

  const addSkillManual = async () => {
    const newSkill = inputValue.trim();
    if (newSkill !== "" && !skills.includes(newSkill)) {
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      setInputValue("");
      
      try {
        await updateProfile({ skills: updatedSkills });
        toast.success(t('skill_saved'));
      } catch (error) {
        toast.error("Failed to save skill");
        setSkills(skills);
      }
    } else if (newSkill !== "") {
      setInputValue("");
    }
  };

  const handleAddSkill = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await addSkillManual();
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const updatedSkills = skills.filter(s => s !== skillToRemove);
    setSkills(updatedSkills);
    try {
      await updateProfile({ skills: updatedSkills });
      toast.info(t('skill_removed'));
    } catch (error) {
      toast.error("Failed to remove skill");
      // Revert optimistic update
      setSkills(skills);
    }
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <div 
            key={skill} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-[13px] font-semibold transition-colors border border-border/50"
          >
            {skill}
            <button 
              onClick={() => handleRemoveSkill(skill)}
              disabled={isLoading}
              className="text-slate-400 hover:text-slate-900 rounded-full outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-secondary disabled:opacity-50"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-xs text-slate-400 italic">No skills added yet.</p>
        )}
      </div>

      <div className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder={t('type_skill')}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleAddSkill}
            disabled={isLoading}
            className="w-full rounded-[12px] border border-border px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-card pr-10 disabled:opacity-50 shadow-sm" 
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 animate-spin" />
          )}
        </div>
        <button
          onClick={addSkillManual}
          disabled={isLoading || !inputValue.trim()}
          className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-[12px] hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center min-w-[80px]"
        >
          {t('add')}
        </button>
      </div>
    </div>
  );
}
