import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimatedHeading from '@/components/ui/animated-heading';

const FAQSection = () => {
  const faqs = [
    {
      question: "How do I start monetizing my content?",
      answer: "Getting started is simple! Sign up for a free account, upload your content (text, videos, images, or links), set your price, and start sharing. You can begin earning immediately once your content goes live."
    },
    {
      question: "What are the platform fees?",
      answer: "We offer transparent pricing: Free plan has 5% platform fee, Creator plan has 3% fee (₹299/month), and Pro plan has just 1% fee (₹599/month). No hidden charges or setup fees."
    },
    {
      question: "How do withdrawals work?",
      answer: "You can request withdrawals through your profile dashboard. All withdrawal requests are processed manually by our team within 24-48 hours. We support bank transfers and UPI payments for Indian creators."
    },
    {
      question: "What types of content can I monetize?",
      answer: "You can monetize various content types including articles, tutorials, videos, images, exclusive links, courses, templates, and digital products. Our platform supports multiple formats to suit different creator needs."
    },
    {
      question: "Is my content protected?",
      answer: "Yes! We use advanced security measures including secure file URLs, payment protection, and content access controls. Only paying customers can access your premium content."
    },
    {
      question: "Can I customize my creator profile?",
      answer: "Absolutely! You can customize your profile with your branding, bio, social links, and showcase your best content. Pro users get additional white-label customization options."
    },
    {
      question: "Do you provide analytics?",
      answer: "Yes, we provide detailed analytics including views, sales, revenue trends, audience insights, and performance metrics. Creator and Pro plans get advanced analytics with deeper insights."
    },
    {
      question: "How do I get paid?",
      answer: "Payments are processed securely through Razorpay. Customer payments are instantly credited to your account balance, and you can withdraw earnings through bank transfer or UPI."
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="text-center mb-16 space-y-4">
        <AnimatedHeading level={2} variant="gradient">
          Frequently Asked Questions
        </AnimatedHeading>
        <p className="text-readable max-w-3xl mx-auto text-lg">
          Got questions? We've got answers. Find everything you need to know about monetizing your content.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="glass-card backdrop-blur-xl rounded-2xl border border-border px-6"
            >
              <AccordionTrigger className="text-left text-high-contrast hover:text-primary transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-readable pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="text-center mt-12">
        <p className="text-readable">
          Still have questions?{' '}
          <a href="/contact" className="text-primary hover:text-primary/80 font-medium">
            Contact our support team
          </a>
        </p>
      </div>
    </section>
  );
};

export default FAQSection;