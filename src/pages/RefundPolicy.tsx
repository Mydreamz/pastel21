import React from 'react';
import { AlertTriangle } from 'lucide-react';
import MainNav from '@/components/navigation/MainNav';
import Footer from '@/components/navigation/Footer';
import { useState } from 'react';
import AuthDialog from '@/components/auth/AuthDialog';

const RefundPolicy = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Cancellation & Refund Policy</h1>
            <p className="text-muted-foreground text-lg">
              Important information about our refund and cancellation policies
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4 p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold text-destructive mb-2">No Refunds Policy</h2>
                <p className="text-foreground">
                  All purchases on Monitize.club are final. We do not offer refunds for any digital content purchases.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Why No Refunds?</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Due to the digital nature of our content, once you purchase and access content, it cannot be "returned" 
                    like a physical product. Our no-refund policy exists because:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Digital content is delivered instantly and can be consumed immediately</li>
                    <li>We cannot verify if digital content has been "used" or downloaded</li>
                    <li>This policy protects content creators from potential abuse</li>
                    <li>It ensures fair compensation for creators' work and effort</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Before You Purchase</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>To help you make informed decisions:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Review content previews and descriptions carefully</li>
                    <li>Check the content type (text, media, link) and format</li>
                    <li>Read creator profiles and ratings if available</li>
                    <li>Contact creators directly if you have specific questions</li>
                    <li>Ensure you understand what you're purchasing</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Exceptional Circumstances</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    While our standard policy is no refunds, we may consider exceptions in rare cases:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Technical errors that prevented content delivery</li>
                    <li>Content that significantly differs from its description</li>
                    <li>Duplicate charges due to payment processing errors</li>
                    <li>Fraudulent transactions (subject to investigation)</li>
                  </ul>
                  <p className="mt-4">
                    If you believe your situation qualifies for an exception, contact us at{' '}
                    <a href="mailto:monitizedotclub@gmail.com" className="text-primary hover:underline">
                      monitizedotclub@gmail.com
                    </a>{' '}
                    with detailed information about your purchase and the issue.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Payment Disputes</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    If you experience unauthorized charges or payment issues:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Contact us immediately with transaction details</li>
                    <li>Provide screenshots or documentation of the issue</li>
                    <li>We will investigate and respond within 48 hours</li>
                    <li>We work with payment processors to resolve genuine disputes</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Account Cancellation</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    You may cancel your Monitize.club account at any time:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Account cancellation does not entitle you to refunds for previous purchases</li>
                    <li>You will retain access to purchased content even after account cancellation</li>
                    <li>Creator earnings and withdrawals are not affected by account cancellation</li>
                  </ul>
                </div>
              </section>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                This policy was last updated on January 2025. We reserve the right to modify this policy at any time. 
                Changes will be effective immediately upon posting on our website.
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

export default RefundPolicy;