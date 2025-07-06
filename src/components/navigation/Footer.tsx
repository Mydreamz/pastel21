
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-8 border-t border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400">
        <div className="flex flex-col md:flex-row gap-6 text-center md:text-left">
          <div>
            <span className="font-medium">Contact us:</span>{' '}
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
          <div>
            <span className="font-medium">Cancellation & Refund:</span>{' '}
            <Link to="/refund-policy" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
          <div>
            <span className="font-medium">Privacy Policy:</span>{' '}
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
          <div>
            <span className="font-medium">Terms:</span>{' '}
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
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
