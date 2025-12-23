import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { HomePage } from "./pages/HomePage";
import { RaiseRequest } from "./pages/RaiseRequest";
import { MatchResult } from "./pages/MatchResult";
import { Dashboard } from "./pages/Dashboard";
import { HospitalAdmin } from "./pages/HospitalAdmin";
import HospitalRequests from "./pages/HospitalRequests";
import { AuditLogs } from "./pages/AuditLogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/raise-request" element={<RaiseRequest />} />
          <Route path="/match-result/:requestId" element={<MatchResult />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hospital-admin" element={<HospitalAdmin />} />
          <Route path="/hospital-requests" element={<HospitalRequests />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
