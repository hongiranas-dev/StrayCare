import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { MapPin, PawPrint } from "lucide-react";
import { Report } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { ReportStatusBadge } from "./ReportStatusBadge";
import { motion } from "framer-motion";

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Link href={`/report/${report.id}`}>
      <motion.div 
        whileHover={{ y: -4 }}
        className="block h-full cursor-pointer group"
      >
        <Card className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg border-muted">
          <div className="aspect-[4/3] w-full relative bg-muted/30 overflow-hidden flex items-center justify-center">
            {report.imagePath ? (
              <img
                src={`/api/storage${report.imagePath}`}
                alt="Reported dog"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                <PawPrint className="w-12 h-12" />
                <span className="text-xs font-medium uppercase tracking-wider">No photo</span>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <ReportStatusBadge status={report.status} />
            </div>
          </div>
          <CardContent className="p-5">
            <div className="flex items-start gap-2 mb-3 text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
              <p className="text-sm font-medium line-clamp-1">{report.location}</p>
            </div>
            <p className="text-sm text-foreground line-clamp-2 mb-4 leading-relaxed">
              {report.description}
            </p>
            <div className="text-xs text-muted-foreground font-medium">
              Reported {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
