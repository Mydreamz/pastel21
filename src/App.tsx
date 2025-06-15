
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ContentCacheProvider } from '@/contexts/ContentCacheContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import Home from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import CreateContent from '@/pages/CreateContent';
import ViewContent from '@/pages/ViewContent';
import EditContent from '@/pages/EditContent';
import Marketplace from '@/pages/Marketplace';
import NotFound from '@/pages/NotFound';
import Footer from '@/components/navigation/Footer';
import { Toaster } from '@/components/ui/toaster';
import { BackToTop } from '@/components/ui/back-to-top';
import StarsBackground from '@/components/StarsBackground';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentFailed from '@/pages/PaymentFailed';
import ContentSuccess from '@/pages/ContentSuccess';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ContentCacheProvider>
          <NotificationProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <StarsBackground />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/create" element={<CreateContent />} />
                  <Route path="/view/:id" element={<ViewContent />} />
                  <Route path="/edit/:id" element={<EditContent />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-failed" element={<PaymentFailed />} />
                  <Route path="/success" element={<ContentSuccess />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
                <Toaster />
                <BackToTop />
              </div>
            </Router>
          </NotificationProvider>
        </ContentCacheProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
