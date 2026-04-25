import { useState } from "react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Shield, Clock, CheckCircle2, Trash2, MapPin, MoreHorizontal, ExternalLink, PawPrint } from "lucide-react";
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

export function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
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

  const filteredReports = reports?.filter(r => statusFilter === "all" ? true : r.status === statusFilter) || [];

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rescue Operations</h1>
        <p className="text-muted-foreground mt-1">Manage incoming reports and coordinate volunteers.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">Total Reports</div>
            {isLoadingSummary ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{summary?.total || 0}</div>}
          </CardContent>
        </Card>
        <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10">
          <CardContent className="p-4 sm:p-6">
            <div className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Reported
            </div>
            {isLoadingSummary ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold text-amber-900 dark:text-amber-300">{summary?.reported || 0}</div>}
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10">
          <CardContent className="p-4 sm:p-6">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4" /> In Progress
            </div>
            {isLoadingSummary ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold text-blue-900 dark:text-blue-300">{summary?.inProgress || 0}</div>}
          </CardContent>
        </Card>
        <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/10">
          <CardContent className="p-4 sm:p-6">
            <div className="text-sm font-medium text-emerald-800 dark:text-emerald-400 mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Rescued
            </div>
            {isLoadingSummary ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">{summary?.rescued || 0}</div>}
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Active Reports</h2>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="reported">Reported</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="rescued">Rescued</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg bg-card overflow-hidden">
          {isLoadingReports ? (
            <div className="divide-y">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex gap-4">
                  <Skeleton className="w-16 h-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 mb-3 text-muted" />
              <p>No reports found matching this filter.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredReports.map((report) => (
                <div key={report.id} className="p-4 sm:p-5 flex gap-4 sm:gap-6 hover:bg-muted/30 transition-colors group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    {report.imagePath ? (
                      <img src={`/api/storage${report.imagePath}`} alt="Dog" className="w-full h-full object-cover" />
                    ) : (
                      <PawPrint className="w-6 h-6 text-muted-foreground/30" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-primary shrink-0" />
                          <h3 className="font-medium text-foreground truncate">{report.location}</h3>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <ReportStatusBadge status={report.status} />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 pr-8">{report.description}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Button asChild variant="ghost" size="icon" className="hidden sm:flex h-8 w-8">
                      <Link href={`/report/${report.id}`}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => updateReport.mutate({ id: report.id, data: { status: "reported" } })} disabled={report.status === "reported" || updateReport.isPending}>
                          <Clock className="w-4 h-4 mr-2" /> Mark Reported
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateReport.mutate({ id: report.id, data: { status: "in_progress" } })} disabled={report.status === "in_progress" || updateReport.isPending}>
                          <Shield className="w-4 h-4 mr-2" /> Mark In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateReport.mutate({ id: report.id, data: { status: "rescued" } })} disabled={report.status === "rescued" || updateReport.isPending}>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Rescued
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/report/${report.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setReportToDelete(report)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!reportToDelete} onOpenChange={(open) => !open && setReportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the report from {reportToDelete?.location}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => reportToDelete && deleteReport.mutate({ id: reportToDelete.id })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteReport.isPending}
            >
              {deleteReport.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
