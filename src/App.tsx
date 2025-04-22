import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import CreateContent from "./pages/CreateContent";
import ViewContent from "./pages/ViewContent";
import EditContent from "./pages/EditContent";
import Profile from "./pages/Profile";
import ContentSuccess from "./pages/ContentSuccess";
import NotFound from "./pages/NotFound";
import PreviewContent from "./pages/PreviewContent";
import Search from "./pages/Search";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create" element={<CreateContent />} />
              <Route path="/view/:id" element={<ViewContent />} />
              <Route path="/preview/:id" element={<PreviewContent />} />
              <Route path="/edit/:id" element={<EditContent />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/success" element={<ContentSuccess />} />
              <Route path="/search" element={<Search />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
