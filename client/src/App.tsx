import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Home from "@/pages/home";
import CampaignGenerator from "@/pages/campaign-generator";
import CatalogGenerator from "@/pages/catalog-generator";
import OutputHub from "@/pages/output-hub";
import ExecutiveView from "@/pages/executive-view";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/campaign-generator" component={CampaignGenerator} />
      <Route path="/catalog-generator" component={CatalogGenerator} />
      <Route path="/output/:campaignId" component={OutputHub} />
      <Route path="/executive/:linkId" component={ExecutiveView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-surface to-primary/5">
          <Navigation />
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
