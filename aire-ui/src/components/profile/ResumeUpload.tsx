"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResumeVerificationModal } from "@/components/profile/ResumeVerificationModal";
import { toast } from "sonner";
import api from "@/lib/api";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

export function ResumeUpload() {
  const [isHovering, setIsHovering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const { t } = useTranslation();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files?.length) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX file.");
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/profile/parse-resume", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setParsedData(res.data.data);
      setShowModal(true);
      toast.success(t('resume_parsed'));
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t('resume_fail'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div 
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all bg-card text-center shadow-sm",
          isHovering ? "border-primary bg-primary/5" : "border-border",
          isProcessing && "opacity-80 pointer-events-none"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
        onDragLeave={() => setIsHovering(false)}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept=".pdf,.docx" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          disabled={isProcessing}
        />
        
        {isProcessing ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-10 text-primary animate-spin" />
            <div className="space-y-1">
              <h3 className="font-bold text-foreground">{t('analyzing_resume')}</h3>
              <p className="text-xs text-slate-500">{t('extracting_msg')}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
              <Upload className="size-7 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-foreground">{t('upload_resume')}</h3>
              <p className="text-sm text-slate-500 max-w-[200px]">
                {t('drag_drop')}
              </p>
            </div>
            <p className="text-[10px] font-black text-slate-400 mt-2 p-1 px-2 bg-slate-100 rounded-md uppercase tracking-wider">{t('supported_formats')}</p>
          </div>
        )}
      </div>

      <ResumeVerificationModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        parsedData={parsedData}
      />
    </>
  );
}
