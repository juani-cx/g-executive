import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import Login from "@/pages/login";
import Home from "@/pages/home";
import CanvasView from "@/pages/canvas";
import CampaignGenerator from "@/pages/campaign-generator";
import CatalogGenerator from "@/pages/catalog-generator";
import OutputHub from "@/pages/output-hub";
import ExecutiveView from "@/pages/executive-view";
import NotFound from "@/pages/not-found";

function AuthenticatedRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/canvas" component={CanvasView} />
      <Route path="/campaign-generator" component={CampaignGenerator} />
      <Route path="/catalog-generator" component={CatalogGenerator} />
      <Route path="/output/:campaignId" component={OutputHub} />
      <Route path="/executive/:linkId" component={ExecutiveView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    // Check if user is already logged in (dummy authentication)
    const savedAuth = localStorage.getItem('campaign-ai-auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login from login page
  useEffect(() => {
    const handleLogin = () => {
      localStorage.setItem('campaign-ai-auth', 'true');
      setIsAuthenticated(true);
    };

    // Check if we're coming back from login
    if (location === '/' && !isAuthenticated) {
      const auth = localStorage.getItem('campaign-ai-auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, [location, isAuthenticated]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          {!isAuthenticated ? (
            <Login />
          ) : (
            <AuthenticatedRouter />
          )}
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;