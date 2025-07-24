import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Shipping Policy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Digital content delivery information for Monitize.club
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-primary/20">
              <CardHeader className="text-center">
                <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Instant Delivery</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  All digital products are delivered instantly upon successful payment
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">24/7 Access</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Access your purchased content anytime from your dashboard
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Secure Delivery</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  All content is delivered through secure, encrypted channels
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Digital Product Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">How It Works</h3>
                <p className="text-muted-foreground mb-4">
                  Since Monitize.club exclusively offers digital products (documents, media files, digital content), 
                  there is no physical shipping involved. All products are delivered electronically.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Delivery Process</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="font-medium text-primary">1.</span>
                    Complete your purchase through our secure payment system
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium text-primary">2.</span>
                    Receive instant access to your purchased content
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium text-primary">3.</span>
                    Content appears immediately in your dashboard under "Purchased"
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium text-primary">4.</span>
                    Download or view your content anytime with lifetime access
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Delivery Time</h3>
                <p className="text-muted-foreground">
                  All digital products are delivered <strong>instantly</strong> upon successful payment confirmation. 
                  There are no shipping delays, processing times, or delivery windows to wait for.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Access & Downloads</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Access your purchased content from any device with internet connection</li>
                  <li>• Download files for offline viewing (where applicable)</li>
                  <li>• No expiration dates on your purchased content</li>
                  <li>• Re-download capability from your dashboard</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Troubleshooting</h3>
                <p className="text-muted-foreground mb-2">
                  If you don't see your purchased content immediately:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Check your dashboard under the "Purchased" tab</li>
                  <li>• Ensure your payment was processed successfully</li>
                  <li>• Refresh your browser or app</li>
                  <li>• Contact our support team if issues persist</li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-2">Contact Support</h3>
                <p className="text-muted-foreground">
                  For any delivery-related questions or technical issues, please{' '}
                  <Link to="/contact" className="text-primary hover:underline">
                    contact our support team
                  </Link>
                  . We're here to help ensure you receive your digital content promptly.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>Last updated: January 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;