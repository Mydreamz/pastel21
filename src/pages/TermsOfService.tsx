import React from 'react';
import { FileText, Users, CreditCard } from 'lucide-react';
import MainNav from '@/components/navigation/MainNav';

import { useState } from 'react';
import AuthDialog from '@/components/auth/AuthDialog';

const TermsOfService = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground text-lg">
              Terms and conditions for using Monitize.club
            </p>
          </div>

          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Content Rules</h3>
                <p className="text-sm text-muted-foreground">
                  Guidelines for creating and sharing content
                </p>
              </div>
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">User Conduct</h3>
                <p className="text-sm text-muted-foreground">
                  Expected behavior and responsibilities
                </p>
              </div>
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <CreditCard className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Payment Terms</h3>
                <p className="text-sm text-muted-foreground">
                  Transaction and monetization policies
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    By accessing and using Monitize.club ("the Platform"), you accept and agree to be bound by the terms 
                    and provision of this agreement. If you do not agree to these terms, you should not use this platform.
                  </p>
                  <p>
                    These Terms of Service ("Terms") govern your use of our website, services, and platform. 
                    We reserve the right to update these terms at any time without prior notice.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Platform Description</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Monitize.club is a content monetization platform that allows creators to share and monetize their content, 
                    including text, media files, and links. Users can purchase access to creators' content.
                  </p>
                  <p>Our platform facilitates:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Content creation, sharing, and monetization</li>
                    <li>Secure transactions between creators and buyers</li>
                    <li>Content discovery and marketplace functionality</li>
                    <li>Creator earnings and withdrawal management</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-medium text-foreground">Account Creation</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You must provide accurate and complete information when creating an account</li>
                    <li>You are responsible for maintaining the security of your account credentials</li>
                    <li>You must be at least 18 years old to create an account</li>
                    <li>One account per person is allowed</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">Account Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You are responsible for all activities that occur under your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                    <li>Keep your contact information updated</li>
                    <li>Do not share your account credentials with others</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Content Policies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-medium text-foreground">Acceptable Content</h3>
                  <p>You may upload and monetize content that is:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Original content created by you</li>
                    <li>Content you have legal rights to distribute</li>
                    <li>Educational, informational, or entertainment content</li>
                    <li>Professional services, tutorials, or digital products</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">Prohibited Content</h3>
                  <p>You may not upload content that:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Violates copyright, trademark, or intellectual property rights</li>
                    <li>Contains illegal, harmful, or offensive material</li>
                    <li>Promotes hate speech, discrimination, or violence</li>
                    <li>Contains malware, viruses, or malicious code</li>
                    <li>Violates privacy rights of individuals</li>
                    <li>Is misleading, fraudulent, or deceptive</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-medium text-foreground">Transactions</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All payments are processed securely through our integrated payment system</li>
                    <li>Prices are set by creators and displayed clearly before purchase</li>
                    <li>All sales are final - no refunds are provided (see our Refund Policy)</li>
                    <li>We may charge platform fees on transactions</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">Creator Earnings</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Creators earn money from content sales after platform fees</li>
                    <li>Earnings are tracked in your dashboard and available for withdrawal</li>
                    <li>Withdrawals require valid KYC documentation (PAN, bank details)</li>
                    <li>Minimum withdrawal thresholds may apply</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">Taxes</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Users are responsible for their own tax obligations</li>
                    <li>Creators must comply with local tax laws for their earnings</li>
                    <li>We may provide transaction reports for tax purposes</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. User Conduct</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Users agree not to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Use the platform for any illegal or unauthorized purpose</li>
                    <li>Attempt to bypass payment systems or access content without authorization</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Create fake accounts or impersonate others</li>
                    <li>Attempt to hack, reverse engineer, or compromise platform security</li>
                    <li>Spam, distribute malware, or engage in fraudulent activities</li>
                    <li>Share purchased content with unauthorized parties</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-medium text-foreground">Your Content</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You retain ownership of content you create and upload</li>
                    <li>You grant us a license to host, display, and distribute your content on our platform</li>
                    <li>You represent that you have the right to share and monetize your content</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">Platform Rights</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Monitize.club owns the platform, website, and related intellectual property</li>
                    <li>Our trademarks, logos, and branding are protected</li>
                    <li>Platform features and functionality are proprietary</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Privacy and Data Protection</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Your privacy is important to us. Our data handling practices are detailed in our Privacy Policy, 
                    which is incorporated into these Terms by reference.
                  </p>
                  <p>Key privacy commitments:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>We encrypt all data for maximum security</li>
                    <li>Only buyers and creators can access purchased content</li>
                    <li>We do not sell or share personal data with unauthorized parties</li>
                    <li>Users have control over their data and privacy settings</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    To the maximum extent permitted by law, Monitize.club shall not be liable for any indirect, 
                    incidental, special, consequential, or punitive damages, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Loss of profits, data, or business opportunities</li>
                    <li>Service interruptions or technical issues</li>
                    <li>User-generated content or third-party actions</li>
                    <li>Unauthorized access to accounts or content</li>
                  </ul>
                  <p className="mt-4">
                    Our total liability to you for any claims shall not exceed the amount paid by you to us in the 
                    twelve months preceding the claim.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-medium text-foreground">By Users</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You may terminate your account at any time</li>
                    <li>Account termination does not entitle you to refunds</li>
                    <li>You retain access to purchased content after account closure</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground">By Monitize.club</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>We may suspend or terminate accounts for violations of these Terms</li>
                    <li>We may remove content that violates our policies</li>
                    <li>We reserve the right to refuse service to anyone</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    For questions about these Terms of Service or our platform, contact us at:
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p><strong>Email:</strong> <a href="mailto:monitizedotclub@gmail.com" className="text-primary hover:underline">monitizedotclub@gmail.com</a></p>
                    <p><strong>Subject Line:</strong> Terms of Service Inquiry</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                These Terms of Service were last updated on January 2025. We reserve the right to modify these terms 
                at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.
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

export default TermsOfService;