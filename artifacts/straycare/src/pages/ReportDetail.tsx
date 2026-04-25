import { useRoute } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Info, Calendar, ArrowLeft, PawPrint } from "lucide-react";
import { useGetReport } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ReportStatusBadge } from "@/components/ReportStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";

export function ReportDetail() {
  const [, params] = useRoute("/report/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;

  const { data: report, isLoading, isError } = useGetReport(id, {
    query: {
      enabled: id > 0,
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-[4/3] rounded-2xl w-full" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <Info className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Report not found</h1>
        <p className="text-muted-foreground">This report may have been removed or doesn't exist.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted/30 border shadow-sm flex items-center justify-center relative">
          {report.imagePath ? (
            <img 
              src={`/api/storage${report.imagePath}`} 
              alt="Reported dog" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
              <PawPrint className="w-16 h-16" />
              <span className="text-sm font-medium uppercase tracking-widest">No photo provided</span>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <ReportStatusBadge status={report.status} />
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                <Calendar className="w-3.5 h-3.5" />
                {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
              </div>
            </div>
            
            <div>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Location
              </h2>
              <p className="text-xl font-medium text-foreground">{report.location}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Description
            </h2>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {report.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
