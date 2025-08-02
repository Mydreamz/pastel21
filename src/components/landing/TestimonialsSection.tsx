import React from 'react';
import { Star, Quote } from 'lucide-react';
import AnimatedHeading from '@/components/ui/animated-heading';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Content Creator",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face",
      content: "Monitize.club transformed my creative journey. I've earned ₹25,000+ in just 3 months by sharing my design tutorials. The platform is incredibly user-friendly!",
      earnings: "₹25,000+",
      rating: 5
    },
    {
      name: "Rahul Kumar",
      role: "Tech Educator",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "The analytics and insights helped me understand my audience better. My programming courses now generate consistent monthly revenue of ₹45,000.",
      earnings: "₹45,000/month",
      rating: 5
    },
    {
      name: "Anjali Patel",
      role: "Fitness Coach",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "From sharing free workout tips to building a premium fitness community, this platform made monetization seamless. The support team is amazing!",
      earnings: "₹35,000+",
      rating: 5
    }
  ];

  const stats = [
    { value: "₹50L+", label: "Total Creator Earnings" },
    { value: "5,200+", label: "Active Creators" },
    { value: "25,000+", label: "Content Pieces" },
    { value: "98%", label: "Creator Satisfaction" }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="text-center mb-16 space-y-4">
        <AnimatedHeading level={2} variant="gradient">
          Trusted by successful creators
        </AnimatedHeading>
        <p className="text-readable max-w-3xl mx-auto text-lg">
          Join thousands of creators who are already monetizing their passion and building sustainable income streams.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
            <div className="text-readable text-sm md:text-base">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="glass-card backdrop-blur-xl rounded-2xl p-6 relative">
            <Quote className="h-8 w-8 text-primary/30 absolute top-4 right-4" />
            
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-high-contrast">{testimonial.name}</h4>
                <p className="text-sm text-readable">{testimonial.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>

            <p className="text-readable mb-4 leading-relaxed">
              "{testimonial.content}"
            </p>

            <div className="bg-primary/10 rounded-lg p-3 text-center">
              <span className="text-primary font-semibold">Earned: {testimonial.earnings}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <div className="glass-card backdrop-blur-xl rounded-2xl p-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-high-contrast mb-4">
            🔒 Your Success is Secured
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-medium text-high-contrast mb-1">💳 Secure Payments</div>
              <div className="text-readable">SSL encryption & trusted payment gateways</div>
            </div>
            <div>
              <div className="font-medium text-high-contrast mb-1">🛡️ Content Protection</div>
              <div className="text-readable">Advanced security for your intellectual property</div>
            </div>
            <div>
              <div className="font-medium text-high-contrast mb-1">📞 24/7 Support</div>
              <div className="text-readable">Dedicated support team ready to help</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;