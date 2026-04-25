import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, Info, Image as ImageIcon, HeartHandshake, InfoIcon } from "lucide-react";
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
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <HeartHandshake className="w-4 h-4" />
              Community Rescue
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Help a stray dog find safety.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Seen a dog in need? Tell us where. Our network of local rescue volunteers will receive an alert and head out to help. It takes 30 seconds to make a difference.
            </p>
          </div>

          {!isLoadingSummary && summary && (
            <div className="grid grid-cols-3 gap-4 border rounded-2xl p-4 bg-card/50">
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-primary">{summary.total}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Reports</div>
              </div>
              <div className="text-center space-y-1 border-x">
                <div className="text-2xl font-bold text-blue-600">{summary.inProgress}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">In Progress</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-emerald-600">{summary.rescued}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Rescued</div>
              </div>
            </div>
          )}
        </div>

        {/* Report Form */}
        <Card className="border-primary/20 shadow-xl shadow-primary/5">
          <CardContent className="p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Report a Dog</h2>
                  <p className="text-sm text-muted-foreground">Every detail helps our volunteers find them faster.</p>
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. Near Central Park entrance on 5th Ave" {...field} />
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
                      <FormLabel className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" />
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What does the dog look like? Do they seem injured or scared? Any collar?" 
                          className="min-h-[100px] resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    Photo (Optional)
                  </div>
                  
                  {uploadedImagePath ? (
                    <div className="relative rounded-lg overflow-hidden border aspect-video max-w-sm">
                      <img 
                        src={`/api/storage${uploadedImagePath}`} 
                        alt="Uploaded photo" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setUploadedImagePath(null)}
                      >
                        Remove
                      </Button>
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
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors cursor-pointer text-muted-foreground">
                          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-sm font-medium">Click to upload a photo</span>
                          <span className="text-xs opacity-75 mt-1">Help volunteers recognize the dog</span>
                        </div>
                      </ObjectUploader>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <InfoIcon className="w-3 h-3" />
                        Photos make finding the dog much easier
                      </p>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={createReport.isPending}
                >
                  {createReport.isPending ? "Submitting..." : "Submit Report"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>

      {/* Recent Reports */}
      <section className="space-y-6 pt-8 border-t">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Community Reports</h2>
        </div>

        {isLoadingRecent ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentReports && recentReports.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <ReportCard report={report} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 border rounded-xl bg-muted/20">
            <HeartHandshake className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-foreground">No recent reports</h3>
            <p className="text-muted-foreground">The community is quiet right now.</p>
          </div>
        )}
      </section>
    </div>
  );
}
