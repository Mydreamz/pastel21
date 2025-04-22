
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import StarsBackground from '@/components/StarsBackground';
import ContentPreview from '@/components/ContentPreview';
import FilePreview from '@/components/content/FilePreview';

const ViewContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    // Fetch content from localStorage
    const fetchContent = () => {
      setLoading(true);
      try {
        const storedContents = JSON.parse(localStorage.getItem('contents') || '[]');
        const foundContent = storedContents.find((item: any) => item.id === id);
        
        if (foundContent) {
          setContent(foundContent);
          
          // Check if current user is the creator
          const auth = localStorage.getItem('auth');
          if (auth) {
            const parsedAuth = JSON.parse(auth);
            if (parsedAuth?.user?.id === foundContent.creatorId) {
              setIsCreator(true);
            }
          }
          
          // Check if this content has been paid for
          const paidContents = JSON.parse(localStorage.getItem('paidContents') || '[]');
          const isPaidContent = paidContents.some((item: any) => 
            item.contentId === id && 
            (isCreator || (auth && JSON.parse(auth)?.user?.id === item.userId))
          );
          setIsPaid(isPaidContent);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  // Function to handle successful payment
  const handlePaymentSuccess = () => {
    // Save this content ID as paid for the current user
    try {
      const auth = localStorage.getItem('auth');
      if (auth) {
        const parsedAuth = JSON.parse(auth);
        const userId = parsedAuth?.user?.id;
        
        if (userId) {
          const paidContents = JSON.parse(localStorage.getItem('paidContents') || '[]');
          paidContents.push({
            contentId: id,
            userId: userId,
            paidAt: new Date().toISOString()
          });
          localStorage.setItem('paidContents', JSON.stringify(paidContents));
          setIsPaid(true);
        }
      }
    } catch (error) {
      console.error("Error saving payment status:", error);
    }
  };

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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Creator view - always show if user is creator */}
          {isCreator && (
            <Card className="glass-card border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-xl">Creator View</CardTitle>
                <CardDescription className="text-gray-300">
                  You created this content on {new Date(content.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File preview for creator */}
                {content.fileUrl && ['image', 'video', 'audio', 'document'].includes(content.contentType) && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Content Preview (Only visible to you)</h3>
                    <FilePreview 
                      fileUrl={content.fileUrl}
                      fileName={content.fileName}
                      fileType={content.fileType}
                      contentType={content.contentType}
                    />
                    
                    {content.content && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-300">Description</h4>
                        <p className="text-white mt-1">{content.content}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {(content.contentType === 'text' || content.contentType === 'link') && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Content Preview</h3>
                    <div className="bg-white/5 p-4 rounded-md border border-white/10">
                      {content.contentType === 'link' ? (
                        <a href={content.content} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline break-all">
                          {content.content}
                        </a>
                      ) : (
                        <p className="whitespace-pre-wrap">{content.content}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={() => navigate(`/edit/${content.id}`)} 
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    Edit Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Content preview or full content based on payment status */}
          <div className={isCreator ? "lg:col-start-2" : "max-w-xl mx-auto w-full"}>
            {isPaid ? (
              <Card className="glass-card border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-xl">{content.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {content.teaser}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Display unlocked content based on type */}
                  {content.fileUrl && ['image', 'video', 'audio', 'document'].includes(content.contentType) && (
                    <FilePreview 
                      fileUrl={content.fileUrl}
                      fileName={content.fileName}
                      fileType={content.fileType}
                      contentType={content.contentType}
                    />
                  )}
                  
                  {(content.contentType === 'text' || content.contentType === 'link') && (
                    <div className="bg-white/5 p-4 rounded-md border border-white/10">
                      {content.contentType === 'link' ? (
                        <a href={content.content} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline break-all">
                          {content.content}
                        </a>
                      ) : (
                        <p className="whitespace-pre-wrap">{content.content}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <ContentPreview 
                title={content.title}
                teaser={content.teaser}
                price={parseFloat(content.price)}
                type={content.contentType || 'text'}
                expiryDate={content.expiry || undefined}
                onPaymentSuccess={handlePaymentSuccess}
                contentId={content.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContent;
