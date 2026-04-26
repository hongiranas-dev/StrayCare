import { Card, CardContent } from "@/components/ui/card";
import { SearchX, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto border-border/60 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden text-center bg-card/80 backdrop-blur-md">
        <CardContent className="pt-12 pb-12 px-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
            <SearchX className="h-10 w-10 text-muted-foreground" />
          </div>
          
          <h1 className="font-serif text-3xl font-bold text-foreground mb-3">Page Not Found</h1>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-[250px]">
            We couldn't find the page you're looking for.
          </p>
          
          <Button asChild size="lg" className="rounded-xl h-12 px-8 font-semibold shadow-md">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
