import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import AnimatedHeading from '@/components/ui/animated-heading';

interface PricingSectionProps {
  openAuthDialog: (tab: 'login' | 'signup') => void;
}

const PricingSection = ({ openAuthDialog }: PricingSectionProps) => {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Up to 10 content pieces",
        "Basic analytics",
        "Standard support",
        "5% platform fee"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Creator",
      price: "₹299",
      period: "month",
      description: "For growing creators",
      features: [
        "Unlimited content",
        "Advanced analytics",
        "Priority support",
        "3% platform fee",
        "Custom branding",
        "Scheduled publishing"
      ],
      cta: "Start Creating",
      popular: true
    },
    {
      name: "Pro",
      price: "₹599",
      period: "month", 
      description: "For established creators",
      features: [
        "Everything in Creator",
        "1% platform fee",
        "White-label solution",
        "API access",
        "Dedicated account manager",
        "Advanced integrations"
      ],
      cta: "Go Pro",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="text-center mb-16 space-y-4">
        <AnimatedHeading level={2} variant="gradient">
          Simple, transparent pricing
        </AnimatedHeading>
        <p className="text-readable max-w-3xl mx-auto text-lg">
          Choose the plan that fits your creator journey. Upgrade or downgrade anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`glass-card backdrop-blur-xl rounded-2xl p-8 relative transition-all duration-300 hover:shadow-elevated ${
              plan.popular ? 'border-2 border-primary scale-105' : 'border border-border'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-2 text-high-contrast">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold text-high-contrast">{plan.price}</span>
                <span className="text-readable">/{plan.period}</span>
              </div>
              <p className="text-readable">{plan.description}</p>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-readable">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              className={`w-full ${
                plan.popular 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
              }`}
              size="lg"
              onClick={() => openAuthDialog('signup')}
            >
              {plan.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-readable mb-4">
          All plans include secure payments, instant payouts, and 24/7 support.
        </p>
        <p className="text-sm text-muted-foreground">
          No setup fees. Cancel anytime. 30-day money-back guarantee.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;