import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { MapPin, PawPrint, ChevronRight } from "lucide-react";
import { Report } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { ReportStatusBadge } from "./ReportStatusBadge";
import { motion } from "framer-motion";

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Link href={`/report/${report.id}`} className="block h-full group focus:outline-none">
      <Card className="h-full overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20 rounded-2xl flex flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/50 flex items-center justify-center p-2">
          {report.imagePath ? (
            <img
              src={`/api/storage${report.imagePath}`}
              alt="Reported dog"
              className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
              <PawPrint className="w-12 h-12" />
              <span className="text-xs font-medium uppercase tracking-widest">No Photo</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <ReportStatusBadge status={report.status} />
          </div>
        </div>
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-start gap-2 text-muted-foreground flex-1">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground line-clamp-1">{report.location}</h3>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-1">
            {report.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 block"></span>
              {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
              View <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
