
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
        setRecentContents(data);
      } catch (error: any) {
        console.error('Error fetching recent content:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recent content',
          variant: 'destructive',
        });
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
      {[...Array(6)].map((_, index) => (
        <Card key={`skeleton-${index}`} className="glass-card border-pastel-200/50 shadow-neumorphic rounded-2xl overflow-hidden">
          <CardHeader>
            <Skeleton className="h-5 w-3/4 bg-pastel-200/50" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2 bg-pastel-200/40" />
            <Skeleton className="h-4 w-4/5 mb-2 bg-pastel-200/40" />
            <Skeleton className="h-4 w-2/3 bg-pastel-200/40" />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Skeleton className="h-4 w-12 bg-pastel-200/40" />
            <Skeleton className="h-8 w-16 bg-pastel-200/40" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="py-16" id="contents">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Recent Content</h2>
        {isAuthenticated && (
          <Button onClick={() => navigate('/create')} className="bg-pastel-500 hover:bg-pastel-600 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Content
          </Button>
        )}
      </div>
      
      {loading ? (
        renderSkeletonCards()
      ) : recentContents.length === 0 ? (
        <Card className="glass-card border-pastel-200/50 text-center p-8 shadow-neumorphic">
          <p className="text-gray-600">No content available yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentContents.map((content) => (
            <Card key={content.id} className="glass-card border-pastel-200/50 shadow-neumorphic rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-semibold truncate text-gray-800">{content.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm line-clamp-3">{content.teaser}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {parseFloat(content.price) > 0 && (
                    <div className="flex items-center text-pastel-700">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {parseFloat(content.price).toFixed(2)}
                      {!isAuthenticated && <Lock className="h-3 w-3 ml-1" />}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {user && content.creator_id === user.id && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/edit/${content.id}`)}
                      className="border-pastel-200 hover:bg-pastel-100 text-gray-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={() => handleViewContent(content)}
                    variant="secondary"
                    size="sm"
                    className="bg-pastel-100 hover:bg-pastel-200 text-gray-700"
                  >
                    View
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentContent;
