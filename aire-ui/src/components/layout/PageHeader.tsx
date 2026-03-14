import { useUserStore } from "@/store/userStore";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  const { profile } = useUserStore();
  const userInitial = profile?.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-border">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-[28px] font-bold text-foreground tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm font-medium text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {children}

        {/* User Avatar */}
        <div className="flex items-center gap-3 ml-2 border-l border-border pl-6">
          <div className="flex flex-col items-end mr-2 hidden sm:flex">
            <span className="text-xs font-bold text-slate-900">{profile?.full_name || "User"}</span>
            <span className="text-[10px] text-slate-500 font-medium">Student</span>
          </div>
          <button className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-black/5 hover:bg-primary/20 transition-colors">
            {userInitial}
          </button>
        </div>
      </div>
    </header>
  );
}
