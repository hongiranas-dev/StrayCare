import { useState } from "react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Shield, ShieldCheck, Clock, CheckCircle2, Trash2, MapPin, MoreHorizontal, ExternalLink, PawPrint, Activity, LayoutDashboard, Search } from "lucide-react";
import { 
  useListReports, 
  useGetReportsSummary, 
  useUpdateReport, 
  useDeleteReport,
  Report,
  ReportStatus,
  getListReportsQueryKey,
  getGetReportsSummaryQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReportStatusBadge } from "@/components/ReportStatusBadge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  const { data: reports, isLoading: isLoadingReports } = useListReports();
  const { data: summary, isLoading: isLoadingSummary } = useGetReportsSummary();

  const updateReport = useUpdateReport({
    mutation: {
      onSuccess: () => {
        toast({ title: "Status updated" });
        queryClient.invalidateQueries({ queryKey: getListReportsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetReportsSummaryQueryKey() });
      }
    }
  });

  const deleteReport = useDeleteReport({
    mutation: {
      onSuccess: () => {
        toast({ title: "Report deleted" });
        setReportToDelete(null);
        queryClient.invalidateQueries({ queryKey: getListReportsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetReportsSummaryQueryKey() });
      }
    }
  });

  const filteredReports = reports?.filter(r => {
    const matchesStatus = statusFilter === "all" ? true : r.status === statusFilter;
    const matchesSearch = r.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold border border-border/50 shadow-sm mb-4">
            <LayoutDashboard className="w-4 h-4 text-primary" />
            Volunteer Dashboard
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">Rescue Operations</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage incoming reports and coordinate volunteers.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-border/60 shadow-lg shadow-primary/5 rounded-2xl overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <LayoutDashboard className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Reports</div>
            {isLoadingSummary ? <Skeleton className="h-10 w-20" /> : <div className="text-4xl font-serif font-bold">{summary?.total || 0}</div>}
          </CardContent>
        </Card>
        
        <Card className="border-amber-200/50 shadow-lg shadow-amber-500/5 rounded-2xl overflow-hidden bg-amber-50/30 dark:bg-amber-900/10">
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-sm font-semibold text-amber-800 dark:text-amber-400/80 mb-1 uppercase tracking-wider">Reported</div>
            {isLoadingSummary ? <Skeleton className="h-10 w-20" /> : <div className="text-4xl font-serif font-bold text-amber-900 dark:text-amber-100">{summary?.reported || 0}</div>}
          </CardContent>
        </Card>
        
        <Card className="border-blue-200/50 shadow-lg shadow-blue-500/5 rounded-2xl overflow-hidden bg-blue-50/30 dark:bg-blue-900/10">
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-sm font-semibold text-blue-800 dark:text-blue-400/80 mb-1 uppercase tracking-wider">In Progress</div>
            {isLoadingSummary ? <Skeleton className="h-10 w-20" /> : <div className="text-4xl font-serif font-bold text-blue-900 dark:text-blue-100">{summary?.inProgress || 0}</div>}
          </CardContent>
        </Card>
        
        <Card className="border-emerald-200/50 shadow-lg shadow-emerald-500/5 rounded-2xl overflow-hidden bg-emerald-50/30 dark:bg-emerald-900/10">
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-400/80 mb-1 uppercase tracking-wider">Rescued</div>
            {isLoadingSummary ? <Skeleton className="h-10 w-20" /> : <div className="text-4xl font-serif font-bold text-emerald-900 dark:text-emerald-100">{summary?.rescued || 0}</div>}
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-bold w-full sm:w-auto">Active Reports</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11 w-full sm:w-[250px] rounded-xl bg-card border-border/60 shadow-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 w-full sm:w-[180px] rounded-xl bg-card border-border/60 shadow-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="rescued">Rescued</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border border-border/60 shadow-xl shadow-primary/5 rounded-3xl bg-card/80 backdrop-blur-sm overflow-hidden">
          {isLoadingReports ? (
            <div className="divide-y divide-border/50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-6 flex gap-6">
                  <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground mb-2">No reports found</h3>
              <p>No reports match your current filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredReports.map((report, i) => (
                <motion.div 
                  key={report.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:gap-6 hover:bg-muted/30 transition-colors group"
                >
                  <div className="w-full sm:w-28 sm:h-28 aspect-video sm:aspect-square shrink-0 rounded-xl overflow-hidden bg-muted/50 flex items-center justify-center relative shadow-sm border border-border/50">
                    {report.imagePath ? (
                      <img src={`/api/storage${report.imagePath}`} alt="Dog" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <PawPrint className="w-8 h-8 text-muted-foreground/30" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <MapPin className="w-4 h-4 text-primary shrink-0" />
                          <h3 className="font-semibold text-lg text-foreground truncate">{report.location}</h3>
                        </div>
                        <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 block"></span>
                          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <ReportStatusBadge status={report.status} />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 pr-8 mt-2 flex-1 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center justify-end sm:items-start gap-2 mt-4 sm:mt-0">
                    <Button asChild variant="outline" size="sm" className="hidden sm:flex rounded-lg shadow-sm">
                      <Link href={`/report/${report.id}`}>
                        <ExternalLink className="w-4 h-4 mr-2" /> View
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-lg shadow-sm w-9 h-9">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl w-48">
                        <DropdownMenuLabel className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Update Status</DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => updateReport.mutate({ id: report.id, data: { status: "reported" } })} 
                          disabled={report.status === "reported" || updateReport.isPending}
                          className="font-medium rounded-lg m-1"
                        >
                          <Clock className="w-4 h-4 mr-2 text-amber-500" /> Mark Reported
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => updateReport.mutate({ id: report.id, data: { status: "in_progress" } })} 
                          disabled={report.status === "in_progress" || updateReport.isPending}
                          className="font-medium rounded-lg m-1"
                        >
                          <Activity className="w-4 h-4 mr-2 text-blue-500" /> Mark In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => updateReport.mutate({ id: report.id, data: { status: "rescued" } })} 
                          disabled={report.status === "rescued" || updateReport.isPending}
                          className="font-medium rounded-lg m-1"
                        >
                          <ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" /> Mark Rescued
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="font-medium rounded-lg m-1 sm:hidden">
                          <Link href={`/report/${report.id}`}>
                            <ExternalLink className="w-4 h-4 mr-2" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive font-medium rounded-lg m-1" 
                          onClick={() => setReportToDelete(report)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!reportToDelete} onOpenChange={(open) => !open && setReportToDelete(null)}>
        <AlertDialogContent className="rounded-3xl p-6 sm:p-8 border-border/50">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="font-serif text-2xl">Delete this report?</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground mt-2">
              This will permanently delete the report from <span className="font-semibold text-foreground">{reportToDelete?.location}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3 sm:gap-2">
            <AlertDialogCancel className="rounded-xl h-11">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => reportToDelete && deleteReport.mutate({ id: reportToDelete.id })}
              className="rounded-xl h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
              disabled={deleteReport.isPending}
            >
              {deleteReport.isPending ? "Deleting..." : "Delete Report"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
