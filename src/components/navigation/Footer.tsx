
import React from 'react';

const Footer = () => {
  return (
    <footer className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-8 border-t border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400">
        <div className="flex flex-col md:flex-row gap-6 text-center md:text-left">
          <div>
            <span className="font-medium">Contact us:</span>{' '}
            <a href="mailto:monitizedotclub@gmail.com" className="hover:text-white transition-colors">
              monitizedotclub@gmail.com
            </a>
          </div>
          <div>
            <span className="font-medium">Cancellation & Refund:</span>{' '}
            <span>No refunds allowed</span>
          </div>
          <div>
            <span className="font-medium">Privacy Policy:</span>{' '}
            <span>We encrypt all data - only buyer and creator can see the content</span>
          </div>
        </div>
        <div className="text-gray-500 text-center">
          © 2025 Monitize.club. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
