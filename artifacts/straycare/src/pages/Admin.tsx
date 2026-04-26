import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { formatDistanceToNow, isToday } from "date-fns";
import { 
  ShieldCheck, 
  Trash2, 
  MapPin, 
  MoreHorizontal, 
  ExternalLink, 
  PawPrint, 
  Activity, 
  LayoutDashboard, 
  Search,
  FileText,
  Sunrise,
  Image as ImageIcon,
  RotateCw,
  Check,
  Moon,
  Menu
} from "lucide-react";
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
import { ReportStatusBadge } from "@/components/ReportStatusBadge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 20 });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString();
      }
    });
  }, [springValue]);

  return <span ref={ref}>{value}</span>;
}

import { CityInsights } from "@/components/CityInsights";

export function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [cycleStatusMap, setCycleStatusMap] = useState<Record<number, "idle" | "success">>({});

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

  const handleCycleStatus = async (report: Report) => {
    const cycleMap: Record<ReportStatus, ReportStatus> = {
      "reported": "in_progress",
      "in_progress": "rescued",
      "rescued": "reported"
    };
    const nextStatus = cycleMap[report.status];
    
    try {
      await updateReport.mutateAsync({ id: report.id, data: { status: nextStatus } });
      setCycleStatusMap(prev => ({ ...prev, [report.id]: "success" }));
      setTimeout(() => {
        setCycleStatusMap(prev => ({ ...prev, [report.id]: "idle" }));
      }, 600);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredReports = reports?.filter(r => {
    const matchesStatus = statusFilter === "all" ? true : r.status === statusFilter;
    const matchesSearch = r.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  const todayCount = reports?.filter(r => isToday(new Date(r.createdAt))).length || 0;
  const withImagesCount = reports?.filter(r => r.imagePath !== null).length || 0;
  const withImagesPercent = reports?.length ? Math.round((withImagesCount / reports.length) * 100) : 0;

  return (
    <div className="dark min-h-screen bg-[#0f1117] text-white font-admin-sans relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#22c55e] opacity-10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#f97316] opacity-10 blur-3xl rounded-full pointer-events-none" />
      <svg className="hidden">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch"/>
        </filter>
      </svg>
      <div className="admin-noise"></div>

      {/* Dashboard Navbar */}
      <nav className="sticky top-0 z-50 h-16 backdrop-blur-xl bg-white/[0.03] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-orange-500 flex items-center justify-center shadow-lg">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <span className="font-admin-serif font-bold text-white tracking-tight">StrayCare</span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-emerald-500 to-orange-500 rounded-full ml-2">Admin</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl">
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild className="text-white hover:text-white hover:bg-white/10 rounded-xl">
              <Link href="/admin">Rescue Team</Link>
            </Button>
          </div>
          
          <div className="md:hidden">
             <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white/70 hover:bg-white/10 rounded-full">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px] p-6 bg-[#0f1117] border-white/10 dark text-white">
                <div className="flex flex-col gap-6 mt-8">
                  <Link href="/" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                    <span className="font-medium text-lg">Home</span>
                  </Link>
                  <Link href="/admin" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                    <span className="font-medium text-lg">Rescue Team</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24 relative z-10"
      >
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-emerald-400 font-semibold text-sm tracking-wide uppercase mb-2">Volunteer Console</div>
            <h1 className="font-admin-serif text-4xl font-bold text-white tracking-tight">Rescue Operations</h1>
            <p className="text-white/50 mt-2 text-lg">Manage incoming reports and coordinate volunteers.</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-white/80 text-xs font-medium shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
            Updated just now
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-[1px] rounded-[17px] bg-gradient-to-br from-emerald-500/40 to-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)] group">
            <div className="relative rounded-2xl p-6 bg-[#0f1117]/80 backdrop-blur border border-white/[0.03] h-full transition-colors group-hover:bg-[#0f1117]/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white/80" />
                </div>
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Total Reports</div>
              </div>
              {isLoadingSummary ? <Skeleton className="h-12 w-24 bg-white/10 rounded-xl" /> : (
                <>
                  <div className="text-5xl font-admin-serif font-bold text-white"><AnimatedCounter value={summary?.total || 0} /></div>
                  <div className="text-sm text-white/50 mt-2">+{summary?.last7Days || 0} from last 7 days</div>
                </>
              )}
            </div>
          </div>

          <div className="p-[1px] rounded-[17px] bg-gradient-to-br from-emerald-500/40 to-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)] group">
            <div className="relative rounded-2xl p-6 bg-[#0f1117]/80 backdrop-blur border border-white/[0.03] h-full transition-colors group-hover:bg-[#0f1117]/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Sunrise className="w-5 h-5 text-white/80" />
                </div>
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Today</div>
              </div>
              {isLoadingReports ? <Skeleton className="h-12 w-24 bg-white/10 rounded-xl" /> : (
                <>
                  <div className="text-5xl font-admin-serif font-bold text-white"><AnimatedCounter value={todayCount} /></div>
                  <div className="text-sm text-white/50 mt-2">in the last 24 hours</div>
                </>
              )}
            </div>
          </div>

          <div className="p-[1px] rounded-[17px] bg-gradient-to-br from-emerald-500/40 to-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)] group">
            <div className="relative rounded-2xl p-6 bg-[#0f1117]/80 backdrop-blur border border-white/[0.03] h-full transition-colors group-hover:bg-[#0f1117]/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-white/80" />
                </div>
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">With Images</div>
              </div>
              {isLoadingReports ? <Skeleton className="h-12 w-24 bg-white/10 rounded-xl" /> : (
                <>
                  <div className="text-5xl font-admin-serif font-bold text-white"><AnimatedCounter value={withImagesCount} /></div>
                  <div className="text-sm text-white/50 mt-2">{withImagesPercent}% have a photo</div>
                </>
              )}
            </div>
          </div>

          <div className="p-[1px] rounded-[17px] bg-gradient-to-br from-emerald-500/40 to-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)] group">
            <div className="relative rounded-2xl p-6 bg-[#0f1117]/80 backdrop-blur border border-white/[0.03] h-full transition-colors group-hover:bg-[#0f1117]/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white/80" />
                </div>
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Rescued</div>
              </div>
              {isLoadingSummary ? <Skeleton className="h-12 w-24 bg-white/10 rounded-xl" /> : (
                <>
                  <div className="text-5xl font-admin-serif font-bold text-white"><AnimatedCounter value={summary?.rescued || 0} /></div>
                  <div className="text-sm text-white/50 mt-2">Lives saved this month</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reports List Section */}
        <div className="space-y-6 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4">
                <h2 className="font-admin-serif text-xl font-bold text-white">All Reports</h2>
                <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
                  {reports?.length || 0} active
                </div>
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-orange-500 rounded-full mt-2" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input 
                  placeholder="Search location..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-11 w-full rounded-xl bg-white/[0.04] border-white/10 text-white placeholder:text-white/40 focus-visible:ring-emerald-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11 w-full sm:w-[180px] rounded-xl bg-white/[0.04] border-white/10 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1d24] border-white/10 text-white rounded-xl">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="rescued">Rescued</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="ghost" 
                onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                className="h-11 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full sm:w-auto"
              >
                Clear filters
              </Button>
            </div>
          </div>

          {isLoadingReports ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                  <Skeleton className="w-full aspect-[16/10] rounded-xl bg-white/5" />
                  <Skeleton className="h-5 w-2/3 bg-white/5" />
                  <Skeleton className="h-4 w-full bg-white/5" />
                  <Skeleton className="h-4 w-1/2 bg-white/5" />
                </div>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center px-4">
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 bg-white/5 rounded-full blur-xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PawPrint className="w-16 h-16 text-white/20" />
                </div>
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-2 right-4"
                >
                  <Moon className="w-4 h-4 text-emerald-500/40" />
                </motion.div>
                <motion.div 
                  animate={{ y: [0, -8, 0] }} 
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-6 right-0"
                >
                  <Moon className="w-5 h-5 text-emerald-500/50" />
                </motion.div>
                <motion.div 
                  animate={{ y: [0, -12, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -top-2 right-10"
                >
                  <Moon className="w-3 h-3 text-emerald-500/30" />
                </motion.div>
              </div>
              <h3 className="text-2xl font-admin-serif font-bold text-white mb-2">All quiet for now</h3>
              <p className="text-white/50 mb-8 max-w-md">
                {searchQuery || statusFilter !== "all" 
                  ? "No reports match your filters." 
                  : "Be the first to report a stray in your area."}
              </p>
              <Button asChild className="rounded-xl h-12 px-8 bg-gradient-to-r from-emerald-500 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/20 border-0">
                <Link href="/">Submit a report</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredReports.map((report, i) => (
                <motion.div 
                  key={report.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, ease: "easeOut" }}
                  className="group relative bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)] transition-all duration-200 cursor-pointer flex flex-col"
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest('button') && !(e.target as HTMLElement).closest('[role="dialog"]')) {
                      window.location.href = `/report/${report.id}`;
                    }
                  }}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#15171d]">
                    {report.imagePath ? (
                      <img src={`/api/storage${report.imagePath}`} alt="Dog" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
                        <PawPrint className="w-12 h-12 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start gap-2 mb-3">
                      <span className="shrink-0 mt-0.5 text-emerald-400">
                        <MapPin className="w-4 h-4" />
                      </span>
                      <h3 className="font-admin-serif font-semibold text-sm bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text text-transparent line-clamp-2">
                        {report.location}
                      </h3>
                    </div>
                    
                    <p className="text-[13px] text-white/70 line-clamp-2 mb-3 font-admin-sans">
                      {report.description}
                    </p>
                    
                    <div className="text-xs text-white/40 mb-5">
                      {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                      <div onClick={(e) => e.stopPropagation()}>
                        <ReportStatusBadge status={report.status} variant="dark" />
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCycleStatus(report);
                          }}
                          disabled={updateReport.isPending}
                        >
                          <AnimatePresence mode="wait">
                            {cycleStatusMap[report.id] === "success" ? (
                              <motion.div
                                key="success"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                              >
                                <Check className="w-4 h-4 text-emerald-400" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="cycle"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                              >
                                <RotateCw className="w-4 h-4" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReportToDelete(report);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <CityInsights />

        <AlertDialog open={!!reportToDelete} onOpenChange={(open) => !open && setReportToDelete(null)}>
          <AlertDialogContent className="bg-[#1a1d24] border-white/10 text-white rounded-2xl">
            <AlertDialogHeader>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <AlertDialogTitle className="font-admin-serif text-xl">Delete this report?</AlertDialogTitle>
              <AlertDialogDescription className="text-white/60">
                This will permanently delete the report from <span className="font-semibold text-white">{reportToDelete?.location}</span>. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 gap-2 sm:gap-2 border-t border-white/5 pt-4">
              <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5 rounded-xl h-11">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => reportToDelete && deleteReport.mutate({ id: reportToDelete.id })}
                className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-11 border-0"
                disabled={deleteReport.isPending}
              >
                {deleteReport.isPending ? "Deleting..." : "Delete Report"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
}
