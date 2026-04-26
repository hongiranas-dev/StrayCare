import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, Info, Image as ImageIcon, HeartHandshake, InfoIcon, ShieldCheck, Clock, Activity, ArrowRight } from "lucide-react";
import { 
  useCreateReport, 
  useGetRecentReports, 
  useGetReportsSummary,
  getGetRecentReportsQueryKey,
  getGetReportsSummaryQueryKey
} from "@workspace/api-client-react";
import { ObjectUploader } from "@workspace/object-storage-web";
import { useToast } from "@/hooks/use-toast";
import { ReportCard } from "@/components/ReportCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

const formSchema = z.object({
  location: z.string().min(1, "Please tell us where you saw the dog"),
  description: z.string().min(1, "Please describe the dog and the situation"),
  imagePath: z.string().nullable().optional()
});

export function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);

  const { data: recentReports, isLoading: isLoadingRecent } = useGetRecentReports({ limit: 6 });
  const { data: summary, isLoading: isLoadingSummary } = useGetReportsSummary();

  const createReport = useCreateReport({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Report submitted",
          description: "Thank you. Our rescue volunteers have been notified.",
        });
        form.reset();
        setUploadedImagePath(null);
        queryClient.invalidateQueries({ queryKey: getGetRecentReportsQueryKey({ limit: 6 }) });
        queryClient.invalidateQueries({ queryKey: getGetReportsSummaryQueryKey() });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try submitting your report again.",
        });
      }
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      description: "",
      imagePath: null,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createReport.mutate({ data: { ...values, imagePath: uploadedImagePath } });
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Hero Section with abstract soft gradients */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] opacity-60 mix-blend-multiply translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[80px] opacity-60 mix-blend-multiply -translate-x-1/3 translate-y-1/4 pointer-events-none"></div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold border border-border/50 shadow-sm"
              >
                <HeartHandshake className="w-4 h-4 text-primary" />
                Community Rescue Network
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
              >
                Help a stray dog find <span className="text-gradient">safety.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl font-medium"
              >
                Seen a dog in need? Tell us where. Our network of local rescue volunteers will receive an alert and head out to help immediately.
              </motion.p>
            </div>

            {!isLoadingSummary && summary && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-3 gap-4 border border-border/60 rounded-3xl p-6 bg-card/60 backdrop-blur-md shadow-xl shadow-primary/5"
              >
                <div className="space-y-1.5">
                  <div className="text-3xl font-bold font-serif">{summary.total}</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5" /> Total
                  </div>
                </div>
                <div className="space-y-1.5 border-l border-border pl-4">
                  <div className="text-3xl font-bold font-serif text-blue-600 dark:text-blue-400">{summary.inProgress}</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> Active
                  </div>
                </div>
                <div className="space-y-1.5 border-l border-border pl-4">
                  <div className="text-3xl font-bold font-serif text-emerald-600 dark:text-emerald-400">{summary.rescued}</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Rescued
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Premium Report Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 20 }}
          >
            <Card className="border-border/60 shadow-2xl shadow-primary/10 rounded-3xl overflow-hidden bg-card/95 backdrop-blur-xl">
              <div className="bg-primary/5 p-6 border-b border-border/50">
                <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                  Submit a Report
                </h2>
                <p className="text-sm text-muted-foreground mt-1 font-medium">Every detail helps our volunteers find them faster.</p>
              </div>
              <CardContent className="p-6 sm:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" /> Location
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="E.g. Near Central Park entrance on 5th Ave" 
                              className="h-12 px-4 rounded-xl bg-muted/50 border-transparent focus-visible:bg-background focus-visible:ring-primary focus-visible:border-primary transition-all text-base shadow-inner-sm"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" /> Description
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What does the dog look like? Do they seem injured or scared?" 
                              className="min-h-[120px] resize-none p-4 rounded-xl bg-muted/50 border-transparent focus-visible:bg-background focus-visible:ring-primary focus-visible:border-primary transition-all text-base shadow-inner-sm"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3">
                      <div className="text-sm font-semibold flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" /> Photo (Optional)
                      </div>
                      
                      {uploadedImagePath ? (
                        <div className="relative rounded-xl overflow-hidden border-2 border-primary/20 aspect-video max-w-sm group shadow-md">
                          <img 
                            src={`/api/storage${uploadedImagePath}`} 
                            alt="Uploaded photo" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="rounded-full shadow-lg"
                              onClick={() => setUploadedImagePath(null)}
                            >
                              Remove Photo
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full">
                          <ObjectUploader
                            onGetUploadParameters={async (file) => {
                              const res = await fetch("/api/storage/uploads/request-url", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  name: file.name,
                                  size: file.size,
                                  contentType: file.type || "application/octet-stream",
                                }),
                              });
                              const data = await res.json();
                              setUploadedImagePath(data.objectPath);
                              return {
                                method: "PUT",
                                url: data.uploadURL,
                                headers: { "Content-Type": file.type || "application/octet-stream" },
                              };
                            }}
                            buttonClassName="w-full"
                          >
                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-muted/30 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer text-muted-foreground group">
                              <div className="w-12 h-12 rounded-full bg-background shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <ImageIcon className="w-6 h-6 text-primary/70" />
                              </div>
                              <span className="text-sm font-semibold text-foreground">Click to upload a photo</span>
                              <span className="text-sm mt-1">Help volunteers recognize the dog</span>
                            </div>
                          </ObjectUploader>
                        </div>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all bg-gradient-to-r from-primary to-primary/90" 
                      size="lg"
                      disabled={createReport.isPending}
                    >
                      {createReport.isPending ? "Submitting..." : "Submit Report"}
                      {!createReport.isPending && <ArrowRight className="w-5 h-5 ml-2" />}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-tight mb-2">Community Reports</h2>
            <p className="text-muted-foreground font-medium">Recent sightings submitted by neighbors.</p>
          </div>
          <Button asChild variant="outline" className="rounded-full shadow-sm hover:bg-primary/5 hover:text-primary border-border/60">
            <Link href="/admin">View Rescue Team Board <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>

        {isLoadingRecent ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-border/50 rounded-2xl">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentReports && recentReports.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {recentReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 50 }}
              >
                <ReportCard report={report} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 border border-dashed rounded-3xl bg-muted/20">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <HeartHandshake className="w-8 h-8 text-primary/50" />
            </div>
            <h3 className="text-xl font-bold font-serif mb-2">No recent reports</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">The community is quiet right now. When a report is submitted, it will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
