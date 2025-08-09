import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Username from "./pages/Username";
import Dashboard from "./pages/Dashboard";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import TrendDetail from "./pages/TrendDetail";
import EventDetail from "./pages/EventDetail";
import StoryDetail from "./pages/StoryDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/username" element={<Username />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/analysis" element={<DocumentAnalysis />} />
          <Route path="/trend/:id" element={<TrendDetail />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/story/:id" element={<StoryDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
