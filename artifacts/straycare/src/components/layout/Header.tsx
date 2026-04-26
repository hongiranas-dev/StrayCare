import { Link, useLocation } from "wouter";
import { PawPrint, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm" 
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container max-w-7xl mx-auto flex h-16 sm:h-20 items-center px-4 sm:px-6 lg:px-8 justify-between">
        <Link href="/" className="flex items-center gap-2.5 group transition-transform active:scale-95">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-sm group-hover:shadow-md transition-all">
            <PawPrint className="w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-2xl tracking-tight text-foreground">StrayCare</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-secondary/50 backdrop-blur-sm px-1.5 py-1.5 rounded-full border border-border/50">
          <Link 
            href="/" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              location === "/" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            Home
          </Link>
          <Link 
            href="/safety" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              location === "/safety" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            Safety
          </Link>
          <Link 
            href="/admin" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              location === "/admin" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            Rescue Team
          </Link>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px] p-6 bg-background">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors">
                  <span className="font-medium text-lg">Home</span>
                </Link>
                <Link href="/safety" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors">
                  <span className="font-medium text-lg">Safety</span>
                </Link>
                <Link href="/admin" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors">
                  <span className="font-medium text-lg">Rescue Team</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
