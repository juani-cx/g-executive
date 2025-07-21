import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  
  // Hide navigation on executive view
  if (location.startsWith('/executive/')) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-outline-variant px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-on-surface">Campaign AI Gen</h1>
              <p className="text-sm text-on-surface-variant">AI-Powered Marketing Platform</p>
            </div>
          </div>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-on-surface-variant hover:text-on-surface">
            Documentation
          </Button>
          <Button variant="ghost" className="text-on-surface-variant hover:text-on-surface">
            Support
          </Button>
          <Link href="/">
            <Button className="bg-primary text-white hover:shadow-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
