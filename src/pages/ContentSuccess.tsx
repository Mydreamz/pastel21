
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Eye } from 'lucide-react';
import StarsBackground from '@/components/StarsBackground';
import ContentActions from '@/components/content/ContentActions';

const ContentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const content = location.state?.content;

  if (!content) {
    navigate('/');
    return null;
  }

  // Construct the shareable URL
  const shareUrl = `${window.location.origin}/view/${content.id}`;
  const contentTitle = content.title;

  // Debug the content object to ensure we have all necessary data
  console.log("Content data in ContentSuccess:", content);

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <Card className="glass-card border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-center text-emerald-400">
              Content Created Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg mb-2">Your content has been {content.status === 'scheduled' ? 'scheduled' : 'published'}!</p>
              {content.status === 'scheduled' && (
                <p className="text-gray-400">
                  Your content will be published on {new Date(content.scheduled_for).toLocaleDateString()} at {content.scheduled_time}
                </p>
              )}
            </div>

            {/* Share button options with clear emphasis */}
            <div className="flex flex-col items-center mt-6 mb-6">
              <h3 className="text-lg font-medium mb-3">Share your content</h3>
              <div className="w-full flex justify-center">
                <ContentActions 
                  onShare={() => {}} // No-op; handled inside ContentActions
                  shareUrl={shareUrl}
                  contentTitle={contentTitle}
                  contentId={content.id}
                  isCreator={true}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button onClick={() => navigate(`/edit/${content.id}`)} className="bg-white/10 hover:bg-white/20 text-white">
                <Edit className="mr-2 h-4 w-4" />
                Edit Content
              </Button>
              <Button onClick={() => navigate(`/view/${content.id}`)} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Eye className="mr-2 h-4 w-4" />
                View Content
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentSuccess;
