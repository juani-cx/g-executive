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
import Home from "@/pages/home";
import CanvasView from "@/pages/canvas";
import CampaignGenerator from "@/pages/campaign-generator";
import CatalogGenerator from "@/pages/catalog-generator";
import OutputHub from "@/pages/output-hub";
import ExecutiveView from "@/pages/executive-view";
import NotFound from "@/pages/not-found";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  }
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3
};

function AuthenticatedRouter() {
  const [location] = useLocation();
  
  return (
    <div className="w-full h-full">
      <AnimatePresence mode="wait" initial={true}>
        <motion.div
          key={location}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full h-full"
        >
          <Switch>
            <Route path="/" component={NewLanding} />
            <Route path="/homepage" component={Landing} />
            <Route path="/prompt-input" component={PromptInput} />
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
        <div className="min-h-screen">
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