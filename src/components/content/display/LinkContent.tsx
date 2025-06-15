
import React from 'react';

interface LinkContentProps {
  content?: string;
}

const LinkContent = ({ content }: LinkContentProps) => {
  if (!content) return null;
  
  let url;
  try {
    url = new URL(content);
  } catch (_) {
    return (
      <div className="bg-white/50 p-4 rounded-xl shadow-neumorphic">
        <p className="text-red-500">Invalid link provided.</p>
      </div>
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return (
      <div className="bg-white/50 p-4 rounded-xl shadow-neumorphic">
        <p className="text-red-500">Insecure link: only http/https links are allowed.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/50 p-4 rounded-xl shadow-neumorphic">
      <a 
        href={url.href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-pastel-700 hover:underline break-all"
      >
        {url.href}
      </a>
    </div>
  );
};

export default LinkContent;
