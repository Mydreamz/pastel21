
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Lock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecentContentProps {
  recentContents: any[];
  isAuthenticated: boolean;
  openAuthDialog: (tab: 'login' | 'signup') => void;
}

const RecentContent = ({ recentContents, isAuthenticated, openAuthDialog }: RecentContentProps) => {
  const navigate = useNavigate();
  const auth = localStorage.getItem('auth');
  const userData = auth ? JSON.parse(auth).user : null;

  return (
    <section className="py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Recent Content</h2>
        {isAuthenticated && (
          <Button onClick={() => navigate('/create')} className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Content
          </Button>
        )}
      </div>
      
      {recentContents.length === 0 ? (
        <Card className="glass-card border-white/10 text-center p-8">
          <p className="text-gray-400">No content available yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentContents.map((content) => (
            <Card key={content.id} className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold truncate">{content.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm line-clamp-3">{content.teaser}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {parseFloat(content.price) > 0 && (
                    <div className="flex items-center text-emerald-400">
                      <Lock className="h-4 w-4 mr-1" />
                      ${parseFloat(content.price).toFixed(2)}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {userData && content.creatorId === userData.id && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/edit/${content.id}`)}
                      className="border-white/10 hover:bg-white/10"
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
