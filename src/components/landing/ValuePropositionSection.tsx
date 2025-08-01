import React from 'react';
import { TrendingUp, Shield, Zap, Users, CreditCard, BarChart3 } from 'lucide-react';
import AnimatedHeading from '@/components/ui/animated-heading';

const ValuePropositionSection = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Multiple Revenue Streams",
      description: "Content sales, subscriptions, tips, sponsorships, and more - diversify your income like never before.",
      benefits: ["Content sales", "Monthly subscriptions", "One-time tips", "Sponsored content"]
    },
    {
      icon: Shield,
      title: "Secure & Protected",
      description: "Advanced security ensures your content and earnings are always safe with encrypted storage and payments.",
      benefits: ["SSL encryption", "Secure file URLs", "Payment protection", "Content access control"]
    },
    {
      icon: Zap,
      title: "Instant Monetization",
      description: "Start earning immediately! No waiting periods, no complex setups - just upload and monetize.",
      benefits: ["Immediate earnings", "Real-time payments", "Quick setup", "No waiting periods"]
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into your audience, content performance, and revenue trends to optimize your strategy.",
      benefits: ["Revenue analytics", "Audience insights", "Performance metrics", "Growth tracking"]
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Build a loyal community around your content with engagement tools and direct audience interaction.",
      benefits: ["Comment system", "Community features", "Direct messaging", "Audience engagement"]
    },
    {
      icon: CreditCard,
      title: "Transparent Pricing",
      description: "No hidden fees, clear pricing structure, and the lowest platform fees in the industry.",
      benefits: ["Low platform fees", "No hidden charges", "Transparent pricing", "Flexible plans"]
    }
  ];

  const comparisonData = [
    { feature: "Platform Fee", us: "7%", others: "10-30%" },
    { feature: "Setup Time", us: "< 5 minutes", others: "Hours/Days" },
    { feature: "Content Types", us: "All formats", others: "Limited" },
    { feature: "Analytics", us: "Advanced", others: "Basic" },
    { feature: "Support", us: "24/7", others: "Email only" }
  ];

  return (
    <section className="py-16 md:py-24 space-y-24">
      {/* Main Value Proposition */}
      <div>
        <div className="text-center mb-16 space-y-4">
          <AnimatedHeading level={2} variant="gradient">
            Why creators choose Monitize.club
          </AnimatedHeading>
          <p className="text-readable max-w-3xl mx-auto text-lg">
            We've built the most creator-friendly platform with the tools, security, and support you need to succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="glass-card backdrop-blur-xl rounded-2xl p-6 hover:shadow-elevated transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-high-contrast">{feature.title}</h3>
                </div>
                
                <p className="text-readable mb-4 leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-readable">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div>
        <div className="text-center mb-16 space-y-4">
          <AnimatedHeading level={3} variant="gradient">
            How we compare to others
          </AnimatedHeading>
          <p className="text-readable max-w-2xl mx-auto">
            See why creators are switching to Monitize.club for better rates, features, and support.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-6 text-high-contrast font-semibold">Feature</th>
                    <th className="text-center p-6 text-primary font-semibold">Monitize.club</th>
                    <th className="text-center p-6 text-readable font-semibold">Others</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-b border-border last:border-b-0">
                      <td className="p-6 text-high-contrast font-medium">{row.feature}</td>
                      <td className="p-6 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {row.us}
                        </span>
                      </td>
                      <td className="p-6 text-center text-readable">{row.others}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Calculator */}
      <div>
        <div className="text-center mb-16 space-y-4">
          <AnimatedHeading level={3} variant="gradient">
            Calculate your potential earnings
          </AnimatedHeading>
          <p className="text-readable max-w-2xl mx-auto">
            See how much you could earn with our transparent, creator-friendly fee structure.
          </p>
        </div>

        <div className="max-w-2xl mx-auto glass-card backdrop-blur-xl rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-high-contrast">Example Earnings</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-readable">Course at ₹999</span>
                  <span className="text-high-contrast font-medium">₹929*</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-readable">Monthly subscription ₹299</span>
                  <span className="text-high-contrast font-medium">₹278*</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-readable">Digital template ₹499</span>
                  <span className="text-high-contrast font-medium">₹464*</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-high-contrast">Monthly Potential</h4>
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">₹25,000+</div>
                <div className="text-sm text-readable">Average creator earnings</div>
              </div>
              <div className="text-xs text-muted-foreground">
                *Based on 7% platform fee. Actual earnings may vary.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;