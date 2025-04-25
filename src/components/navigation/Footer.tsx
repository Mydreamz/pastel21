
import React from 'react';

const Footer = () => {
  const footerLinks = {
    Product: ["Features", "Pricing", "Integrations", "Updates"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Resources: ["Documentation", "Guides", "Support", "API"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"]
  };

  const socialLinks = [
    { name: "Twitter", url: "https://twitter.com/monitizeclub" },
    { name: "LinkedIn", url: "https://linkedin.com/company/monitizeclub" },
    { name: "Instagram", url: "https://instagram.com/monitizeclub" },
    { name: "Discord", url: "https://discord.gg/monitizeclub" }
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
                className="text-gray-400 hover:text-emerald-500 transition-colors"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
