import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, ThumbsUp, User } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { supabase } from '@/integrations/supabase/client';

type Comment = {
  id: string;
  contentId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
};

interface CommentSectionProps {
  contentId: string;
  creatorId: string;
}

const CommentSection = ({ contentId, creatorId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const { data: allComments, error } = await supabase
          .from('comments')
          .select('*')
          .eq('content_id', contentId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setComments(allComments || []);
      } catch (e) {
        console.error("Error loading comments:", e);
      }
    };

    loadComments();
  }, [contentId]);

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to leave a comment",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Comment cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const commentData = {
      content_id: contentId,
      user_id: userData.id,
      user_name: userData.name,
      text: newComment.trim(),
      created_at: new Date().toISOString()
    };

    try {
      const { data: inserted, error } = await supabase.from('comments').insert([commentData]).select().single();
      if (error) throw error;

      setComments(prev => [inserted, ...prev]);
      setNewComment('');

      if (userData.id !== creatorId) {
        addNotification({
          title: 'New Comment',
          message: `${userData.name} commented on your content`,
          type: 'interaction',
          link: `/view/${contentId}`
        });
      }

      toast({
        title: "Comment posted"
      });
    } catch (e) {
      console.error("Error saving comment:", e);
      toast({
        title: "Error posting comment",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="glass-card border-white/10 text-white mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-emerald-500" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated ? (
          <div className="space-y-3">
            <Textarea 
              placeholder="Leave a comment..." 
              className="bg-white/5 border-white/10 text-white resize-none min-h-[100px]"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment} 
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Post Comment
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-3 bg-white/5 rounded-md">
            <p className="text-gray-300 mb-2">Sign in to leave a comment</p>
            <Button 
              variant="outline" 
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
            >
              Sign In
            </Button>
          </div>
        )}

        <div className="space-y-4 mt-6">
          {comments.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <div className="font-medium">{comment.user_name}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-200 pl-10">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentSection;
