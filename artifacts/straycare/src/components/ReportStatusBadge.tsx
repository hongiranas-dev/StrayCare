import { ShieldCheck, Clock, Shield, Activity } from "lucide-react";
import { ReportStatus } from "@workspace/api-client-react";

interface ReportStatusBadgeProps {
  status: ReportStatus;
}

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  switch (status) {
    case "reported":
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100/80 text-amber-900 border border-amber-200/50 backdrop-blur-sm dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500/30 shadow-sm">
          <Clock className="w-3.5 h-3.5" />
          <span>Reported</span>
        </div>
      );
    case "in_progress":
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100/80 text-blue-900 border border-blue-200/50 backdrop-blur-sm dark:bg-blue-500/20 dark:text-blue-200 dark:border-blue-500/30 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-400/10 animate-pulse"></div>
          <Activity className="w-3.5 h-3.5 relative z-10" />
          <span className="relative z-10">Volunteer on the way</span>
        </div>
      );
    case "rescued":
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-200/50 backdrop-blur-sm dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/30 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Safe & rescued</span>
        </div>
      );
    default:
      return null;
  }
}
