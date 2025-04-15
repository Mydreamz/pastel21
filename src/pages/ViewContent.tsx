
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import StarsBackground from '@/components/StarsBackground';
import ContentPreview from '@/components/ContentPreview';

const ViewContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch content from localStorage
    const fetchContent = () => {
      setLoading(true);
      try {
        const storedContents = JSON.parse(localStorage.getItem('contents') || '[]');
        const foundContent = storedContents.find((item: any) => item.id === id);
        
        if (foundContent) {
          setContent(foundContent);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading content...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-white mb-4">Content not found</div>
        <Button onClick={() => navigate('/')} className="bg-emerald-500 hover:bg-emerald-600">
          Go back home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      {/* Background elements */}
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <div className="max-w-xl mx-auto">
          <ContentPreview 
            title={content.title}
            teaser={content.teaser}
            price={parseFloat(content.price)}
            type={content.contentType || 'text'}
            expiryDate={content.expiry || undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewContent;
