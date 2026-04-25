import { Link } from "wouter";
import { HeartHandshake } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 max-w-7xl mx-auto w-full justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">StrayCare</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Rescue Team
          </Link>
        </nav>
      </div>
    </header>
  );
}
