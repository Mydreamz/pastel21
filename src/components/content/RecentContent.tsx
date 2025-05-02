
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Lock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/App';
import { useToast } from '@/hooks/use-toast';
import { IndianRupee } from 'lucide-react';

interface RecentContentProps {
  isAuthenticated: boolean;
  openAuthDialog: (tab: 'login' | 'signup') => void;
}

const RecentContent = ({ isAuthenticated, openAuthDialog }: RecentContentProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [recentContents, setRecentContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentContent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('contents')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        
        setRecentContents(data || []);
      } catch (error: any) {
        console.error('Error fetching recent content:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recent content',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecentContent();
  }, [toast]);

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
        <div className="flex justify-center py-10">
          <div className="animate-spin h-8 w-8 border-t-2 border-pastel-500 border-r-2 rounded-full"></div>
        </div>
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
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate(`/view/${content.id}`);
                      } else {
                        openAuthDialog('login');
                      }
                    }}
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
