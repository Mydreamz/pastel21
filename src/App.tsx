
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
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
import ContentSuccess from '@/pages/ContentSuccess';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminLogin from '@/pages/AdminLogin';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Search from '@/pages/Search';
import ContactUs from '@/pages/ContactUs';
import RefundPolicy from '@/pages/RefundPolicy';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import ShippingPolicy from '@/pages/ShippingPolicy';
import PreLaunchTest from '@/pages/PreLaunchTest';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
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
                    <Route path="/success" element={<ContentSuccess />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                    <Route path="/pre-launch-test" element={<PreLaunchTest />} />
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
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
