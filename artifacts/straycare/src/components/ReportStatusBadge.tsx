import { Shield, Clock, CheckCircle2 } from "lucide-react";
import { ReportStatus } from "@workspace/api-client-react";

interface ReportStatusBadgeProps {
  status: ReportStatus;
}

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  switch (status) {
    case "reported":
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          <Clock className="w-3.5 h-3.5" />
          Reported
        </div>
      );
    case "in_progress":
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          <Shield className="w-3.5 h-3.5" />
          Volunteer on the way
        </div>
      );
    case "rescued":
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Safe & rescued
        </div>
      );
    default:
      return null;
  }
}
