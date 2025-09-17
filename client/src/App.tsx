import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "@/pages/login";
import Landing from "@/pages/landing";
import NewLanding from "@/pages/new-landing";
import PromptInput from "@/pages/prompt-input";
import UploadImage from "@/pages/upload-image";
import Configure from "@/pages/configure";
import Preview from "@/pages/preview";
import Home from "@/pages/home";
import CanvasView from "@/pages/canvas";
import CampaignGenerator from "@/pages/campaign-generator";
import CatalogGenerator from "@/pages/catalog-generator";
import OutputHub from "@/pages/output-hub";
import ExecutiveView from "@/pages/executive-view";
import NotFound from "@/pages/not-found";
import Logo from "@/components/Logo";

function AuthenticatedRouter() {
  const [location] = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  
  return (
    <div className="relative">
      {/* Fixed Logo - Outside Animation */}
      <Logo />
      
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => setDisplayLocation(location)}>
        <motion.div 
          key={location}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.25 }}
          className="h-screen max-h-screen overflow-hidden bg-white"
          style={{ willChange: 'opacity, transform' }}
        >
          <Switch location={displayLocation}>
            <Route path="/" component={NewLanding} />
            <Route path="/homepage" component={Landing} />
            <Route path="/prompt-input" component={PromptInput} />
            <Route path="/upload" component={UploadImage} />
            <Route path="/configure" component={Configure} />
            <Route path="/preview" component={Preview} />
            <Route path="/home" component={Home} />
            <Route path="/canvas" component={CanvasView} />
            <Route path="/canvas/:id" component={CanvasView} />
            <Route path="/campaign-generator" component={CampaignGenerator} />
            <Route path="/catalog-generator" component={CatalogGenerator} />
            <Route path="/output/:campaignId" component={OutputHub} />
            <Route path="/executive/:linkId" component={ExecutiveView} />
            <Route component={NotFound} />
          </Switch>
        </motion.div>
      </AnimatePresence>
    </div>
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
        <div className="h-screen max-h-screen overflow-hidden">
          {!isAuthenticated && location !== '/' ? (
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