
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Lock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { IndianRupee } from 'lucide-react';
import { createCacheableRequest } from '@/utils/requestUtils';
import { Skeleton } from "@/components/ui/skeleton";

interface RecentContentProps {
  isAuthenticated: boolean;
  openAuthDialog: (tab: 'login' | 'signup') => void;
}

// Move this outside the component to ensure a stable reference
const fetchRecentContentCached = createCacheableRequest(async () => {
  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);
  if (error) throw error;
  return data || [];
}, 5 * 60 * 1000); // cache for 5 minutes for better performance

const RecentContent = ({ isAuthenticated, openAuthDialog }: RecentContentProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [recentContents, setRecentContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = React.useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    
    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await fetchRecentContentCached();
        // Ensure data is always an array
        setRecentContents(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error('Error fetching recent content:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recent content',
          variant: 'destructive',
        });
        // Set empty array on error
        setRecentContents([]);
      } finally {
        setLoading(false);
        hasFetchedRef.current = true;
      }
    };
    
    fetchContent();
  }, []); // Only run once on mount

  // Function to handle content view action
  const handleViewContent = (content: any) => {
    // For paid content, user must be logged in
    const isPaidContent = parseFloat(content.price) > 0;
    
    if (isPaidContent && !isAuthenticated) {
      // Prompt login for paid content
      openAuthDialog('login');
      toast({
        title: "Authentication Required",
        description: "You need to sign in to access paid content",
      });
    } else {
      // Free content or authenticated user can view
      navigate(`/view/${content.id}`);
    }
  };

  const renderSkeletonCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }, (_, index) => (
        <Card key={`skeleton-${index}`} className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-3/4 bg-muted/50" />
          </CardHeader>
          <CardContent className="pb-4">
            <Skeleton className="h-4 w-full mb-3 bg-muted/40" />
            <Skeleton className="h-4 w-4/5 mb-3 bg-muted/40" />
            <Skeleton className="h-4 w-2/3 bg-muted/40" />
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-4">
            <Skeleton className="h-4 w-16 bg-muted/40" />
            <Skeleton className="h-10 w-20 bg-muted/40 rounded-lg" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8" id="contents">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Recent Content</h2>
            <p className="text-muted-foreground text-lg">Discover the latest from our creators</p>
          </div>
          {isAuthenticated && (
            <Button 
              onClick={() => navigate('/create')} 
              className="font-semibold"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Content
            </Button>
          )}
        </div>
        
        {loading ? (
          renderSkeletonCards()
        ) : (!recentContents || recentContents.length === 0) ? (
          <Card className="border-border/50 text-center p-12 shadow-sm">
            <p className="text-muted-foreground text-lg">No content available yet</p>
            <p className="text-muted-foreground text-sm mt-2">Be the first to create something amazing!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentContents.map((content) => (
              <Card key={content.id} className="border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                    {content.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{content.teaser}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    {parseFloat(content.price) > 0 && (
                      <div className="flex items-center text-primary font-semibold">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {parseFloat(content.price).toFixed(2)}
                        {!isAuthenticated && <Lock className="h-3 w-3 ml-2 text-muted-foreground" />}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {user && content.creator_id === user.id && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/edit/${content.id}`)}
                        className="border-border hover:bg-accent"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      onClick={() => handleViewContent(content)}
                      variant="secondary"
                      size="sm"
                      className="font-medium"
                    >
                      View
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentContent;
