import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "./components/layout/Header";
import { Home } from "./pages/Home";
import { ReportDetail } from "./pages/ReportDetail";
import { Admin } from "./pages/Admin";
import { Safety } from "./pages/Safety";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  const [location] = useLocation();
  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-background selection:bg-primary/20">
      {location !== "/admin" && <Header />}
      <main className="flex-1 w-full mx-auto relative z-0">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/safety" component={Safety} />
          <Route path="/report/:id" component={ReportDetail} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
