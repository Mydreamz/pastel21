import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';
import MainNav from '@/components/navigation/MainNav';

import { useState } from 'react';
import AuthDialog from '@/components/auth/AuthDialog';

const PrivacyPolicy = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground text-lg">
              How we protect and handle your personal information
            </p>
          </div>

          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Data Protection</h3>
                <p className="text-sm text-muted-foreground">
                  We encrypt all data to ensure maximum security
                </p>
              </div>
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Secure Access</h3>
                <p className="text-sm text-muted-foreground">
                  Only buyers and creators can access content
                </p>
              </div>
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <Eye className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  Your content remains private and secure
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Our Privacy Commitment</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    At Monitize.club, we are committed to protecting your privacy and ensuring the security of your personal information. 
                    Our platform is built with privacy-first principles, where we encrypt all data and ensure that only authorized parties 
                    can access content.
                  </p>
                  <p>
                    <strong>Key Privacy Principle:</strong> We encrypt all data, and only the buyer and creator can see the content. 
                    This ensures maximum privacy and security for all users on our platform.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-medium text-foreground">Account Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Email address (for account creation and communication)</li>
                    <li>Profile information (name, bio, social media links - optional)</li>
                    <li>Payment information (for transactions and withdrawals)</li>
                    <li>KYC details (PAN, bank details for creators)</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">Content Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Content you create and upload to the platform</li>
                    <li>Content metadata (titles, descriptions, tags)</li>
                    <li>Purchase history and transaction records</li>
                    <li>Content access logs (for creators to track views)</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">Technical Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Device information and browser type</li>
                    <li>IP address and location data (for security purposes)</li>
                    <li>Usage analytics and platform interaction data</li>
                    <li>Error logs and performance metrics</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                <div className="space-y-4 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Service Delivery:</strong> To provide platform functionality and content access</li>
                    <li><strong>Account Management:</strong> To maintain your account and process transactions</li>
                    <li><strong>Communication:</strong> To send important updates, notifications, and support responses</li>
                    <li><strong>Security:</strong> To protect against fraud, abuse, and unauthorized access</li>
                    <li><strong>Analytics:</strong> To improve platform performance and user experience</li>
                    <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Data Security & Encryption</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong>End-to-End Encryption:</strong> All content uploaded to our platform is encrypted using industry-standard 
                    encryption protocols. This ensures that your content remains secure and private.
                  </p>
                  <p>
                    <strong>Access Control:</strong> We implement strict access controls where only the content creator and 
                    authorized buyers can access purchased content. Even our platform administrators cannot view your private content.
                  </p>
                  <p>
                    <strong>Secure Infrastructure:</strong> We use secure cloud infrastructure with regular security audits, 
                    automated backups, and monitoring systems to protect against data breaches.
                  </p>
                  <p>
                    <strong>Payment Security:</strong> All payment information is processed through secure, PCI-compliant 
                    payment processors. We do not store sensitive payment details on our servers.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We do not sell, trade, or share your personal information with third parties, except in these limited cases:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Service Providers:</strong> Trusted partners who help us operate the platform (payment processors, cloud hosting)</li>
                    <li><strong>Legal Requirements:</strong> When required by law, court orders, or government regulations</li>
                    <li><strong>Safety & Security:</strong> To protect users from fraud, abuse, or illegal activities</li>
                    <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of our business</li>
                  </ul>
                  <p className="mt-4">
                    <strong>Content Privacy:</strong> Your content is never shared with unauthorized parties. Only you (as the creator) 
                    and authorized buyers have access to your content.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Your Rights & Controls</h2>
                <div className="space-y-4 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Access:</strong> Request access to your personal data and content</li>
                    <li><strong>Update:</strong> Modify or update your account information and profile</li>
                    <li><strong>Delete:</strong> Request deletion of your account and associated data</li>
                    <li><strong>Download:</strong> Export your content and transaction history</li>
                    <li><strong>Control:</strong> Manage privacy settings and communication preferences</li>
                  </ul>
                  <p className="mt-4">
                    To exercise these rights, contact us at{' '}
                    <a href="mailto:monitizedotclub@gmail.com" className="text-primary hover:underline">
                      monitizedotclub@gmail.com
                    </a>
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We retain your information for as long as necessary to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide our services and support your account</li>
                    <li>Comply with legal obligations and resolve disputes</li>
                    <li>Maintain transaction records for tax and accounting purposes</li>
                    <li>Prevent fraud and abuse on our platform</li>
                  </ul>
                  <p className="mt-4">
                    When you delete your account, we will remove your personal information within 30 days, 
                    except for data we are legally required to retain.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    If you have questions about this Privacy Policy or how we handle your information, 
                    please contact us:
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p><strong>Email:</strong> <a href="mailto:monitizedotclub@gmail.com" className="text-primary hover:underline">monitizedotclub@gmail.com</a></p>
                    <p><strong>Subject Line:</strong> Privacy Policy Inquiry</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                This Privacy Policy was last updated on January 2025. We may update this policy from time to time. 
                We will notify users of any significant changes via email or platform notifications.
              </p>
            </div>
          </div>
        </div>
      </main>

      
      
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

export default PrivacyPolicy;