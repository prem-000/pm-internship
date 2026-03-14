"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle2, Clock, XCircle, Briefcase, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApplicationStore, Application } from "@/store/applicationStore";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

const getStatusStyles = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("applied")) return "bg-blue-50 text-blue-700 border-blue-200";
  if (s.includes("interview")) return "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (s.includes("rejected")) return "bg-red-50 text-red-700 border-red-200";
  if (s.includes("offer")) return "bg-green-50 text-green-700 border-green-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
};

const getStatusIcon = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("applied")) return <FileText className="size-3.5" />;
  if (s.includes("interview")) return <Clock className="size-3.5" />;
  if (s.includes("rejected")) return <XCircle className="size-3.5" />;
  if (s.includes("offer")) return <CheckCircle2 className="size-3.5" />;
  return null;
};

export default function ApplicationsPage() {
  const { applications, isLoading, error, fetchApplications } = useApplicationStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader 
        title={t('applications')} 
        subtitle="Track your internship applications and upcoming interviews." 
      />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg font-medium border border-red-200">
          {error}
        </div>
      )}

      <Card className="overflow-hidden p-0 border border-border sm:rounded-[16px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-border text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Date Applied</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="size-6 text-primary animate-spin mx-auto" />
                    <p className="text-slate-500 mt-2 font-medium">Loading applications...</p>
                  </td>
                </tr>
              ) : applications.length > 0 ? (
                applications.map((app: Application) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
                          <Briefcase className="size-4 text-slate-500" />
                        </div>
                        <span className="font-bold text-slate-900">{app.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{app.title}</td>
                    <td className="px-6 py-4 text-slate-500">{app.date}</td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border", getStatusStyles(app.status))}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm font-semibold text-primary hover:text-blue-700 hover:underline transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No applications found. Use the Recommendations page to start applying!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
