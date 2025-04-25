
import React from 'react';
import { Twitter, Linkedin, Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: ["Features", "Pricing", "Integrations", "Updates"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Resources: ["Documentation", "Guides", "Support", "API"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"]
  };

  const socialLinks = [
    { name: "Twitter", icon: <Twitter size={18} />, url: "https://twitter.com/monitizeclub" },
    { name: "LinkedIn", icon: <Linkedin size={18} />, url: "https://linkedin.com/company/monitizeclub" },
    { name: "Instagram", icon: <Instagram size={18} />, url: "https://instagram.com/monitizeclub" },
    { name: "Discord", icon: <MessageCircle size={18} />, url: "https://discord.gg/monitizeclub" }
  ];

  return (
    <footer className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-12 border-t border-gray-800">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category}>
            <h4 className="font-bold mb-4">{category}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © 2025 Monitize.club. All rights reserved.
          </div>
          <div className="flex gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
