
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface RecentContentProps {
  recentContents: any[];
  isAuthenticated: boolean;
  openAuthDialog: (tab: 'login' | 'signup') => void;
}

const RecentContent = ({ recentContents, isAuthenticated, openAuthDialog }: RecentContentProps) => {
  const navigate = useNavigate();
  
  if (!recentContents.length) return null;

  return (
    <section id="contents" className="py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Content</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover the latest premium content from our creators
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recentContents.map((content) => (
          <div key={content.id} className="glass-card rounded-xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{content.title}</h3>
              <p className="text-gray-400 mb-4 line-clamp-2">{content.teaser}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">By {content.creatorName}</div>
                <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                  ${parseFloat(content.price).toFixed(2)}
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 pt-2">
              <Button 
                onClick={() => navigate(`/view/${content.id}`)} 
                className="w-full bg-white/5 hover:bg-white/10 text-white"
              >
                View Content
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {isAuthenticated ? (
        <div className="mt-12 text-center">
          <Button 
            onClick={() => navigate('/create')} 
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
          >
            Create Your Own Content
          </Button>
        </div>
      ) : (
        <div className="mt-12 text-center">
          <Button 
            onClick={() => openAuthDialog('signup')} 
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
          >
            Sign Up to Create Content
          </Button>
        </div>
      )}
    </section>
  );
};

export default RecentContent;
