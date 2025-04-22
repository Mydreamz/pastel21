import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Lock } from 'lucide-react';
import StarsBackground from '@/components/StarsBackground';
import ContentPreview from '@/components/ContentPreview';
import { useViewTracking } from '@/hooks/useViewTracking';
import CommentSection from '@/components/content/CommentSection';
import { useNotifications } from '@/contexts/NotificationContext';

const ViewContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Track view of this content
  useViewTracking();

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('auth');
    if (auth) {
      try {
        const parsedAuth = JSON.parse(auth);
        if (parsedAuth && parsedAuth.user) {
          setIsAuthenticated(true);
          setUserData(parsedAuth.user);
        }
      } catch (e) {
        console.error("Auth parsing error", e);
      }
    }
    
    // Fetch content data
    if (id) {
      try {
        const contents = JSON.parse(localStorage.getItem('contents') || '[]');
        const foundContent = contents.find((item: any) => item.id === id);
        
        if (foundContent) {
          setContent(foundContent);
          
          // Check if content is already unlocked
          const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
          const hasTransaction = transactions.some(
            (tx: any) => tx.contentId === id && tx.userId === (userData?.id || '')
          );
          
          // Content is free or created by the user or already purchased
          if (
            parseFloat(foundContent.price) === 0 || 
            foundContent.creatorId === userData?.id ||
            hasTransaction
          ) {
            setIsUnlocked(true);
          }
        } else {
          setError("Content not found");
        }
      } catch (e) {
        console.error("Error fetching content:", e);
        setError("Error loading content");
      }
      
      setLoading(false);
    }
  }, [id, userData]);

  const handleUnlock = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to unlock this content",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create transaction record
      const transaction = {
        id: crypto.randomUUID(),
        contentId: id,
        userId: userData.id,
        creatorId: content.creatorId,
        amount: content.price,
        timestamp: new Date().toISOString()
      };
      
      // Save transaction
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transactions.push(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      // Unlock the content
      setIsUnlocked(true);
      
      // Show success message
      toast({
        title: "Content unlocked",
        description: `Thank you for your purchase of $${parseFloat(content.price).toFixed(2)}`
      });
      
      // Notify the creator
      addNotification({
        title: "New Purchase",
        message: `${userData.name} purchased your content "${content.title}" for $${parseFloat(content.price).toFixed(2)}`,
        type: 'content',
        link: `/profile`
      });
      
    } catch (e) {
      console.error("Error processing transaction:", e);
      toast({
        title: "Transaction failed",
        description: "There was a problem processing your purchase",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-pulse w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <FileText className="h-6 w-6 text-emerald-500" />
        </div>
        <p className="mt-4 text-gray-400">Loading content...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">
          <FileText className="h-12 w-12" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Content Not Found</h1>
        <p className="text-gray-400 mb-6">{error || "The content you are looking for does not exist."}</p>
        <Button onClick={() => navigate('/')} variant="outline">
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <div className="glass-card border border-white/10 rounded-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{content.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-400 mb-6">
              <span>By {content.creatorName}</span>
              <span className="hidden sm:block">•</span>
              <span>Created {new Date(content.createdAt).toLocaleDateString()}</span>
              {parseFloat(content.price) > 0 && (
                <>
                  <span className="hidden sm:block">•</span>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                    ${parseFloat(content.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300">{content.teaser}</p>
            </div>
            
            {!isUnlocked ? (
              <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-8 w-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">Premium Content</h2>
                <p className="text-gray-400 mb-6">
                  Unlock this content for ${parseFloat(content.price).toFixed(2)}
                </p>
                <Button 
                  onClick={handleUnlock} 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
                >
                  Unlock Now
                </Button>
              </div>
            ) : (
              <ContentPreview 
                title={content.title}
                teaser={content.teaser}
                price={parseFloat(content.price)}
                type={content.contentType}
                expiryDate={content.expiry}
                onPaymentSuccess={handleUnlock}
                contentId={content.id}
              />
            )}
          </div>
        </div>
        
        {isUnlocked && content && (
          <CommentSection contentId={id || ''} creatorId={content.creatorId} />
        )}
      </div>
    </div>
  );
};

export default ViewContent;
