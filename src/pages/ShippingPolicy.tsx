import React from 'react';
import { Zap, Clock, Shield } from 'lucide-react';
import MainNav from '@/components/navigation/MainNav';
import Footer from '@/components/navigation/Footer';
import { useState } from 'react';
import AuthDialog from '@/components/auth/AuthDialog';

const ShippingPolicy = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Shipping Policy</h1>
            <p className="text-muted-foreground text-lg">
              Digital content delivery information for Monitize.club
            </p>
          </div>

          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Instant Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  All digital products are delivered instantly upon successful payment
                </p>
              </div>
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">24/7 Access</h3>
                <p className="text-sm text-muted-foreground">
                  Access your purchased content anytime from your dashboard
                </p>
              </div>
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Secure Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  All content is delivered through secure, encrypted channels
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Digital Product Delivery</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Since Monitize.club exclusively offers digital products (documents, media files, digital content), 
                    there is no physical shipping involved. All products are delivered electronically.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-medium text-foreground">Delivery Process</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Complete your purchase through our secure payment system</li>
                    <li>Receive instant access to your purchased content</li>
                    <li>Content appears immediately in your dashboard under "Purchased"</li>
                    <li>Download or view your content anytime with lifetime access</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Delivery Time</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    All digital products are delivered <strong>instantly</strong> upon successful payment confirmation. 
                    There are no shipping delays, processing times, or delivery windows to wait for.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Access & Downloads</h2>
                <div className="space-y-4 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Multi-Device Access:</strong> Access your purchased content from any device with internet connection</li>
                    <li><strong>Offline Viewing:</strong> Download files for offline viewing (where applicable)</li>
                    <li><strong>Lifetime Access:</strong> No expiration dates on your purchased content</li>
                    <li><strong>Re-download:</strong> Re-download capability from your dashboard anytime</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>If you don't see your purchased content immediately:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Check your dashboard under the "Purchased" tab</li>
                    <li>Ensure your payment was processed successfully</li>
                    <li>Refresh your browser or app</li>
                    <li>Contact our support team if issues persist</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    For any delivery-related questions or technical issues, please contact our support team. 
                    We're here to help ensure you receive your digital content promptly.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p><strong>Email:</strong> <a href="mailto:monitizedotclub@gmail.com" className="text-primary hover:underline">monitizedotclub@gmail.com</a></p>
                    <p><strong>Subject Line:</strong> Shipping Policy Inquiry</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                This Shipping Policy was last updated on January 2025. We may update this policy from time to time. 
                We will notify users of any significant changes via email or platform notifications.
              </p>
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

export default ShippingPolicy;