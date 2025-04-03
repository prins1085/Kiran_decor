import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomerProvider } from "@/context/CustomerContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MattressMaster from "./pages/MattressMaster";
import { MattressProvider } from "./context/MattressContext";
import Layout from "./components/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="quote-pro-theme">
      <TooltipProvider>
        <CustomerProvider>
          <MattressProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/mattress-master" element={<MattressMaster />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
                </Layout>
            </BrowserRouter>
          </MattressProvider>
        </CustomerProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
