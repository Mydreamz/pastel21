import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, User } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

const supabaseToComment = (row: any): Comment => ({
  id: row.id,
  contentId: row.content_id ?? "",
  userId: row.user_id ?? "",
  userName: row.user_name ?? "",
  text: row.text,
  createdAt: row.created_at,
  likes: 0, // Supabase doesn't have likes, use 0 for now.
});

const CommentSection = ({ contentId, creatorId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { user, session } = useAuth();

  useEffect(() => {
    const loadComments = async () => {
      try {
        const { data: allComments, error } = await supabase
          .from('comments')
          .select('*')
          .eq('content_id', contentId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setComments((allComments || []).map(supabaseToComment));
      } catch (e) {
        console.error("Error loading comments:", e);
      }
    };

    loadComments();
  }, [contentId]);

  const handleSubmitComment = async () => {
    if (!session || !user) {
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

    const userName = user.user_metadata?.name || user.email;

    const commentData = {
      content_id: contentId,
      user_id: user.id,
      user_name: userName,
      text: newComment.trim(),
      created_at: new Date().toISOString()
    };

    try {
      const { data: inserted, error } = await supabase.from('comments').insert([commentData]).select().single();
      if (error) throw error;

      setComments(prev => [supabaseToComment(inserted), ...prev]);
      setNewComment('');

      if (user.id !== creatorId) {
        addNotification({
          title: 'New Comment',
          message: `${userName} commented on your content`,
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
        {!!session ? (
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
              asChild
              variant="outline" 
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
            >
              <Link to="/">Sign In</Link>
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
                      <div className="font-medium">{comment.userName}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString()}
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
