import React from 'react';
import { Mail } from 'lucide-react';
import MainNav from '@/components/navigation/MainNav';
import Footer from '@/components/navigation/Footer';
import { useState } from 'react';
import AuthDialog from '@/components/auth/AuthDialog';

const ContactUs = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');

  const openAuthDialog = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setShowAuthDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav openAuthDialog={openAuthDialog} />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="glass-card p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg">
              Have questions or need support? We're here to help!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-6 bg-muted/50 rounded-lg">
                <Mail className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">Email Support</h3>
                  <a 
                    href="mailto:monitizedotclub@gmail.com" 
                    className="text-primary hover:underline"
                  >
                    monitizedotclub@gmail.com
                  </a>
                </div>
              </div>

              <div className="p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Business Hours</h3>
                <p className="text-muted-foreground">
                  Monday - Friday: 9:00 AM - 6:00 PM (IST)<br />
                  Saturday - Sunday: 10:00 AM - 4:00 PM (IST)
                </p>
              </div>

              <div className="p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Response Time</h3>
                <p className="text-muted-foreground">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">General Support</h3>
                <p className="text-muted-foreground mb-2">
                  For questions about using the platform, content creation, or account issues.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please include your account email when contacting us for faster assistance.
                </p>
              </div>

              <div className="p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Payment Issues</h3>
                <p className="text-muted-foreground mb-2">
                  For withdrawal requests, payment problems, or transaction disputes.
                </p>
                <p className="text-sm text-muted-foreground">
                  Include transaction ID or content ID when applicable.
                </p>
              </div>

              <div className="p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Technical Issues</h3>
                <p className="text-muted-foreground">
                  Report bugs, platform issues, or feature requests. Please provide detailed steps to reproduce any issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      <AuthDialog
        showAuthDialog={showAuthDialog}
        setShowAuthDialog={setShowAuthDialog}
        authTab={authTab}
        setAuthTab={setAuthTab}
        setIsAuthenticated={() => {}}
        setUserData={() => {}}
      />
    </div>
  );
};

export default ContactUs;