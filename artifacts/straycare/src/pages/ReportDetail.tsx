import { useRoute } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Info, Calendar, ArrowLeft, PawPrint, Share2 } from "lucide-react";
import { useGetReport } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ReportStatusBadge } from "@/components/ReportStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function ReportDetail() {
  const [, params] = useRoute("/report/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;
  const { toast } = useToast();

  const { data: report, isLoading, isError } = useGetReport(id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Report link copied to clipboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto w-full px-4 py-8 md:py-12 space-y-8">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <Skeleton className="aspect-[4/3] rounded-3xl w-full" />
          <div className="space-y-8 py-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-3 pt-6 border-t">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-6">
        <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <PawPrint className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h1 className="font-serif text-3xl font-bold">Report not found</h1>
        <p className="text-lg text-muted-foreground">This report may have been removed or doesn't exist.</p>
        <Button asChild variant="default" size="lg" className="rounded-xl shadow-lg mt-6">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-24">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors group bg-muted/30 px-4 py-2 rounded-full">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Reports
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden bg-muted/30 border border-border/50 shadow-xl shadow-primary/5 flex items-center justify-center relative sticky top-24"
        >
          {report.imagePath ? (
            <img 
              src={`/api/storage${report.imagePath}`} 
              alt="Reported dog" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-muted-foreground/40">
              <PawPrint className="w-20 h-20" />
              <span className="text-sm font-bold uppercase tracking-widest">No photo provided</span>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-10"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <ReportStatusBadge status={report.status} />
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Reported {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
                {report.location}
              </h1>
              <div className="flex items-center gap-2 text-primary font-medium text-lg">
                <MapPin className="w-5 h-5" />
                Sighting Location
              </div>
            </div>
          </div>

          <div className="bg-card/50 border border-border/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-primary" />
              Description & Details
            </h2>
            <p className="text-foreground text-lg leading-relaxed whitespace-pre-wrap font-medium">
              {report.description}
            </p>
          </div>
          
          <div className="pt-4 flex gap-4">
            <Button onClick={handleShare} variant="outline" size="lg" className="rounded-xl h-14 px-8 font-semibold shadow-sm w-full sm:w-auto">
              <Share2 className="w-5 h-5 mr-2" /> Share Report
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
